1. Program Behavior (Runtime Overview)
When you run the binary (./a.out):

It prompts: "username:" (inferred from first puts at <+30> and your GDB run).
You enter a string (up to ~128 chars, via fgets).
It strips any trailing newline.
Checks the length (post-strip): Must be 8 to 12 inclusive. If not, prints "wrong length!" (inferred) and loops back to prompt again (infinite retries).
If length OK, prompts: "serial number:" (inferred from second puts at <+171>).
You enter a floating-point number (via scanf "%lf").
Processes your username: Alternates case (even indices lowercase, odd uppercase).
Takes the first 8 bytes of this processed string, interprets as integer via atoi.
Converts that integer to double.
Compares it (floating-point) to your entered serial number.
If equal: Prints "s/n OK!" (confirmed in your GDB output at <+525>).
If not: Prints "s/n WRONG!" (at <+539>).
Exits with code 0.

Too short/long username: Loops forever with "wrong length!".
Non-numeric processed username: atoi returns 0 → enter "0" as serial to succeed.
Negative numbers: Possible if username starts with '-' (e.g., "-1234567" → enter "-1234567").
Floating-point input: You can enter decimals (e.g., 123.0), but since the left side is integer-derived, fractional parts must match exactly (i.e., .0).

![alt text](../../images/image.png)

No anti-debugging, no encryption 
1. Disassembly Breakdown
The main function is ~577 bytes, with a loop for username processing and standard libc calls. I'll group it into logical sections.
Setup and Canary (Stack Protection)
text0x555555555289 <+0>: endbr64               ; Intel CET (Control-flow Enforcement)
0x55555555528d <+4>: push rbp
0x55555555528e <+5>: mov rbp,rsp
0x555555555291 <+8>: sub rsp,0x140         ; Allocate 320 bytes stack space
0x555555555298 <+15>: mov rax,QWORD PTR fs:0x28  ; Load stack canary
0x5555555552a1 <+24>: mov QWORD PTR [rbp-0x8],rax ; Store canary
0x5555555552a5 <+28>: xor eax,eax          ; Clear EAX

Standard prologue: Sets up stack frame, allocates buffers.
Buffers: [rbp-0x110] (username, ~128 bytes), [rbp-0x90] (processed username), [rbp-0x120] (first 8 bytes copy), [rbp-0x128] (serial double).
Canary prevents stack overflows (checked at end).

Username Input Loop
text0x5555555552a7 <+30>: lea rdi,[rip+0xd5a]   ; Load "username:" string addr
0x5555555552ae <+37>: call puts@plt
0x5555555552b3 <+42>: mov rax,QWORD PTR [rip+0x2d56] ; stdout
0x5555555552ba <+49>: mov rdi,rax
0x5555555552bd <+52>: call fflush@plt       ; Flush output
0x5555555552c2 <+57>: mov rdx,QWORD PTR [rip+0x2d57] ; stdin
0x5555555552c9 <+64>: lea rax,[rbp-0x110]   ; Username buffer
0x5555555552d0 <+71>: mov esi,0x80          ; Max 128 chars
0x5555555552d5 <+76>: mov rdi,rax
0x5555555552d8 <+79>: call fgets@plt        ; Read input
0x5555555552dd <+84>: lea rax,[rbp-0x110]
0x5555555552e4 <+91>: lea rsi,[rip+0xd27]   ; "\n" string
0x5555555552eb <+98>: mov rdi,rax
0x5555555552ee <+101>: call strcspn@plt     ; Find newline pos
0x5555555552f3 <+106>: mov BYTE PTR [rbp+rax*1-0x110],0x0 ; Null out newline
0x5555555552fb <+114>: lea rax,[rbp-0x110]
0x555555555302 <+121>: mov rdi,rax
0x555555555305 <+124>: call strlen@plt      ; Get length
0x55555555530a <+129>: mov DWORD PTR [rbp-0x134],eax ; Store length
0x555555555310 <+135>: cmp DWORD PTR [rbp-0x134],0x7 ; If <=7
0x555555555317 <+142>: jle 0x555555555322 <main+153>
0x555555555319 <+144>: cmp DWORD PTR [rbp-0x134],0xc ; If >12
0x555555555320 <+151>: jle 0x555555555333 <main+170> ; Proceed if 8-12
0x555555555322 <+153>: lea rdi,[rip+0xcef]   ; "wrong length!"
0x555555555329 <+160>: call puts@plt
0x55555555532e <+165>: jmp 0x5555555552a7 <main+30> ; Loop back

Infinite loop until valid length.
Uses fgets for safe input (no overflow risk).
strcspn + null: Cleanly removes newline.

Serial Number Input
text0x555555555333 <+170>: nop
0x555555555334 <+171>: lea rdi,[rip+0xd00]   ; "serial number:"
0x55555555533b <+178>: call puts@plt
0x555555555340 <+183>: mov rax,QWORD PTR [rip+0x2cc9] ; stdout
0x555555555347 <+190>: mov rdi,rax
0x55555555534a <+193>: call fflush@plt
0x55555555534f <+198>: lea rax,[rbp-0x128]   ; Serial double buffer
0x555555555356 <+205>: mov rsi,rax
0x555555555359 <+208>: lea rdi,[rip+0xcea]   ; "%lf" format
0x555555555360 <+215>: mov eax,0x0
0x555555555365 <+220>: call __isoc99_scanf@plt ; Read double

Prompts and reads a double (allows decimals, but int match needed).

Username Processing Loop
text0x55555555536a <+225>: lea rax,[rbp-0x110]
0x555555555371 <+232>: mov rdi,rax
0x555555555374 <+235>: call strlen@plt       ; Re-get length (redundant?)
0x555555555379 <+240>: mov DWORD PTR [rbp-0x130],eax
0x55555555537f <+246>: mov DWORD PTR [rbp-0x13c],0x0 ; Processed idx = 0
0x555555555389 <+256>: mov DWORD PTR [rbp-0x138],0x0 ; Loop idx = 0
0x555555555393 <+266>: jmp 0x55555555541a <main+401> ; Check loop cond
[Loop body]
0x555555555398 <+271>: mov eax,DWORD PTR [rbp-0x138] ; idx
0x55555555539e <+277>: and eax,0x1           ; idx % 2
0x5555555553a1 <+280>: test eax,eax
0x5555555553a3 <+282>: jne 0x5555555553dd <main+340> ; If odd: toupper
[Even path]
0x5555555553a5 <+284>: ... tolower ...
[Odd path]
0x5555555553dd <+340>: ... toupper ...
[Common]
0x555555555413 <+394>: add DWORD PTR [rbp-0x138],0x1 ; idx++
0x55555555541a <+401>: mov eax,DWORD PTR [rbp-0x138]
0x555555555420 <+407>: cmp eax,DWORD PTR [rbp-0x130] ; idx < len
0x555555555426 <+413>: jl 0x555555555398 <main+271> ; Loop
0x55555555542c <+419>: mov eax,DWORD PTR [rbp-0x13c] ; processed len
0x555555555432 <+425>: cdqe
0x555555555434 <+427>: mov BYTE PTR [rbp+rax*1-0x90],0x0 ; Null terminate

Alternates case per position (even: lower, odd: upper).
Builds in [rbp-0x90].
Handles letters only; digits/symbols unchanged.

Final Processing and Comparison
text0x55555555543c <+435>: lea rcx,[rbp-0x90]     ; Processed buf
0x555555555443 <+442>: lea rax,[rbp-0x120]    ; Copy buf
0x55555555544a <+449>: mov edx,0x8           ; 8 bytes
0x55555555544f <+454>: mov rsi,rcx
0x555555555452 <+457>: mov rdi,rax
0x555555555455 <+460>: call strncpy@plt      ; Copy first 8
0x55555555545a <+465>: mov BYTE PTR [rbp-0x118],0x0 ; Null at pos 8
0x555555555461 <+472>: lea rax,[rbp-0x120]
0x555555555468 <+479>: mov rdi,rax
0x55555555546b <+482>: call atoi@plt         ; Parse to int
0x555555555470 <+487>: mov DWORD PTR [rbp-0x12c],eax ; Store int
0x555555555476 <+493>: pxor xmm0,xmm0
0x55555555547a <+497>: cvtsi2sd xmm0,DWORD PTR [rbp-0x12c] ; Int to double
0x555555555482 <+505>: movsd xmm1,QWORD PTR [rbp-0x128] ; Load serial
0x55555555548a <+513>: ucomisd xmm0,xmm1     ; Compare doubles
0x55555555548e <+517>: jp 0x5555555554a4     ; If NaN/parity
0x555555555490 <+519>: ucomisd xmm0,xmm1     ; Re-compare (redundant?)
0x555555555494 <+523>: jne 0x5555555554a4    ; If not equal → fail
[Success]
0x555555555496 <+525>: lea rdi,[rip+0xbb1]   ; "s/n OK!"
0x55555555549d <+532>: call puts@plt
[Fail]
0x5555555554a4 <+539>: lea rdi,[rip+0xbab]   ; "s/n WRONG!"
0x5555555554ab <+546>: call puts@plt

strncpy + null: Ensures 8-char null-terminated string.
atoi: Parses as signed int (handles '-', stops at non-digit).
Float compare: Uses ucomisd (unordered compare) to handle NaN.

Cleanup
text0x5555555554b0 <+551>: mov eax,0x0           ; Return 0
... canary check ...
0x5555555554c9 <+576>: leave
0x5555555554ca <+577>: ret

Exits cleanly.

3. Key Checks and Logic

Length Check: 8 ≤ len ≤ 12 → Forces controlled input size.
Processing: Alternate case doesn't affect digits/symbols → Key for crafting numeric strings.
Parsing: atoi on first 8 processed chars → Vulnerable to non-digits (defaults to 0 or partial parse).
Comparison: Double equality → Exact match required, but integer-derived left side means serial must be integer-equivalent.
No hashing or complex crypto → Purely didactic.

Strings (from RIP offsets, confirm with x/s in GDB):

0x555555556008: "username:"
0x555555556018: "wrong length!"
0x55555555603b: "serial number:"
0x55555555604a: "%lf"
0x55555555604e: "s/n OK!"
0x555555556056: "s/n WRONG!"
0x555555556012: "\n"

4. Legitimate Solutions
Craft username so processed first-8 parses to desired int N, then enter N as serial.

Simple Positive: Username "12345678" → Processed unchanged → atoi=12345678 → Serial=12345678
With Letters: Username "1a2b3c4d" → Processed "1A2B3C4D" → atoi=123 (stops at 'A') → Serial=123
Negative: Username "-9999999" → atoi=-9999999 → Serial=-9999999
Zero: Any non-starting-with-digit (e.g., "password") → atoi=0 → Serial=0
Max Length: "123456789abc" (12 chars) → First 8 "12345678" → Same as above.

Infinite possibilities — not a "fixed" key, but a relation between inputs.
5. Cracking with GDB (Bypassing Checks)
As you did:

Break at <+523> (jne after compare).
When hit: jump *main+525 → Skip to success puts.