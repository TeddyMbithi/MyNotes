Here is the challenge description:
![Image](../images/Pasted image 20251221233819.png)

Downloading the binary we get this:
![Image](../images/Pasted image 20251221234116.png)

Output Analysis:
- ELF 64-bit LSB pie executable - Linux 64-bit executable with Position Independent Execution
- x86-64 - Intel/AMD 64-bit architecture
- dynamically linked - Uses shared libraries
- stripped - Debug symbols removed, making analysis harder
- for GNU/Linux 3.2.0 - Target Linux version
- 
Key Insight: The "stripped" designation meant I wouldn't have function names or debug symbols, requiring more manual analysis.


From the strings output we get several things:
	1. fgets() is used so definetly not Buffer Overflow
	2. There is a success message and a Fail message 
	3. Critical Strings Identified:
	4. "Nice try, but Santa sees when you're peeking!" - Anti-debugging message
	5. "Coal for you! Tampering detected." - Additional anti-tampering message
	6. "Jingle laughs. Wrong credential length!" - Length validation failure
	7. "Welcome to the mainframe, Operative. Jingle owes the elves a round." - Success message
	8. "Access Denied. Jingle smirks." - Content validation failure
	9. Encoded strings: "!1&9s,6r", "/vs,$0v/q?", "9*3$\"" - Likely encrypted data

Key Functions Detected:
- ptrace - Anti-debugging system call
- fgets, strlen, strcspn - Input handling functions
- __printf_chk, puts - Output functions
	

![Image](../images/Pasted image 20251221234635.png)

Running the binary we get: (With a fail message)
![Image](../images/Pasted image 20251221234745.png)

Analysis:
- The program expects user input (access code)
- It immediately rejects input with a "wrong credential length" message
- This suggests it's checking input length before content validation


Using Ltrace is also unsuccessful
![Image](../images/Pasted image 20251221234901.png)
Strategic Insight: The presence of ptrace indicated sophisticated anti-debugging protection that would need to be bypassed.

Analysis:
- The ptrace(0, 0, 0, 0) call with return value -1 indicates the program is checking if it's being debugged
- When ptrace returns -1, it means another process (debugger) is already tracing this process
- The program immediately exits with the anti-debugging message

I also tried system call tracing:
bash
echo "test" | strace -e trace=write ./day4 2>&1

This also triggered the anti-debugging protection, confirming the binary actively detects analysis attempts.

### Step 5: Disassembly Analysis to Understand Anti-Debugging Mechanism

I disassembled the binary to locate the ptrace call:

bash
objdump -d day4 | grep -A 10 -B 5 ptrace

# Main anti-debugging check:
    1145: 31 c9                xor    %ecx,%ecx      # Clear ECX (4th arg)
    1147: 31 d2                xor    %edx,%edx      # Clear EDX (3rd arg)  
    1149: 31 f6                xor    %esi,%esi      # Clear ESI (2nd arg)
    114b: 31 ff                xor    %edi,%edi      # Clear EDI (1st arg)
    114d: 31 c0                xor    %eax,%eax      # Clear EAX (syscall number)
    114f: e8 bc ff ff ff       call   1110 <ptrace@plt>  # Call ptrace(0,0,0,0)
    1154: 48 ff c0             inc    %rax           # Increment return value
    1157: 75 16                jne    116f           # Jump if NOT zero (not being debugged)
    1159: 48 8d 3d a0 0e 00 00 lea    0xea0(%rip),%rdi  # Load anti-debug message
    1160: e8 5b ff ff ff       call   10c0 <puts@plt>   # Print message
    1165: bf 01 00 00 00       mov    $0x1,%edi      # Exit code 1
    116a: e8 c1 ff ff ff       call   1130 <exit@plt>   # Exit program


Technical Analysis:
- ptrace(PTRACE_TRACEME, 0, 0, 0) - Attempts to trace itself
- If already being traced by a debugger, returns -1
- The code increments the return value (inc %rax)
- If result is not zero (meaning original return was -1), it jumps to the anti-debug message

### Creating a Ptrace Bypass


file: detailed_bypass.c (using tool: write)

 #include <stdio.h>
#include <sys/ptrace.h>
long ptrace(int request, ...) {
fprintf(stderr, "[BYPASS] ptrace() called with request=%d, returning 0\n", request);
return 0;  // Always return success

 run the following command: 
			 gcc -shared -fPIC detailed_bypass.c -o detailed_bypass.so 
Purpose: Compile the detailed bypass

 run the following command:
			 echo -n "test" | LD_PRELOAD=./detailed_bypass.so ./day4 
Purpose: Show the bypass in action with debug output

NPLD Mainframe Authentication
Enter access code: Jingle laughs. Wrong credential length!
[BYPASS] ptrace() called with request=0, returning 0
 
1. [BYPASS] ptrace() called with request=0 - My function was called instead of the real ptrace
2. returning 0 - I forced it to return success
3. The program continued normally instead of showing the anti-debug message

### Why This Works: Dynamic Linking Explained

When a program calls a library function:

1. Compile time: The binary contains a reference to ptrace@plt (Procedure Linkage Table)
2. Runtime: The dynamic linker resolves this to the actual function address
3. LD_PRELOAD: Forces the linker to check my library FIRST

Let me show you the actual linking process:

I will run the following command: 
				echo "Libraries loaded by day4 normally:" && ldd ./day4 (using tool: shell)
Purpose: Show normal library dependencies

Libraries loaded by day4 normally:
	linux-vdso.so.1 (0x00007f8876a32000)
	libc.so.6 => /usr/lib/x86_64-linux-gnu/libc.so.6 (0x00007f8876600000)
	/lib64/ld-linux-x86-64.so.2 (0x00007f8876a34000)


I will run the following command: 
				echo "With LD_PRELOAD:" && LD_PRELOAD=./bypass_ptrace.so ldd ./day4
Purpose: Show library loading with preload

With LD_PRELOAD:
	linux-vdso.so.1 (0x00007ffae4bf2000)
	./bypass_ptrace.so (0x00007ffae4be0000)
	libc.so.6 => /usr/lib/x86_64-linux-gnu/libc.so.6 (0x00007ffae4800000)
	/lib64/ld-linux-x86-64.so.2 (0x00007ffae4bf4000)

> See the difference? My bypass_ptrace.so is loaded BEFORE libc.so.6, so when the binary looks for ptrace, it finds MY version first!

### The Complete Flow

Without bypass:
1. Binary calls ptrace(PTRACE_TRACEME, 0, 0, 0)
2. Dynamic linker finds ptrace in libc.so.6
3. Real ptrace() executes → returns -1 (being debugged)
4. Binary detects debugging → exits with anti-debug message


With bypass:
1. Binary calls ptrace(PTRACE_TRACEME, 0, 0, 0)  
2. Dynamic linker finds ptrace in MY bypass_ptrace.so FIRST
3. My fake ptrace() executes → returns 0 (fake success)
4. Binary thinks it's not being debugged → continues normally


### Why Return 0?

Looking back at the assembly:
assembly
114f: call ptrace           # Call ptrace
1154: inc  %rax            # Increment return value  
1157: jne  116f            # Jump if result != 0


If ptrace returns 0 (not being debugged):
- inc %rax makes it 1
- jne jumps to normal execution (address 116f)

If ptrace returns -1 (being debugged):
- inc %rax makes it 0  
- jne doesn't jump, falls through to anti-debug message

By returning 0, I make the binary think it's not being debugged!

This is a classic technique in malware analysis and reverse engineering - using LD_PRELOAD to intercept and modify system calls without 
actually patching the binary itself.



### Step 7: Deep Disassembly Analysis of Main Logic

With anti-debugging bypassed, I analyzed the main program flow:

bash
objdump -d day4 | grep -A 50 "1140"


Critical Code Sections Identified:

Input Reading Section (addresses 11b3-11c2):
assembly
11b3: 48 8b 15 56 2e 00 00  mov    0x2e56(%rip),%rdx    # Load stdin
11ba: be 40 00 00 00             mov    $0x40,%esi                 # Buffer size 64 bytes
11bf: 48 89 df                          mov    %rbx,%rdi                  # Buffer address
11c2: e8 39 ff ff ff                    call   1100 <fgets@plt>           # Read input


String Processing (addresses 11cc-11db):
assembly
11cc: 48 89 df                                 mov    %rbx,%rdi            # Input string
11cf: 48 8d 35 ac 0e 00 00            lea    0xeac(%rip),%rsi     # "\n" character
11d6: e8 15 ff ff ff                           call   10f0 <strcspn@plt>  # Find newline
11db: 48 89 df                                 mov    %rbx,%rdi            # Input string
11de: c6 44 04 08 00                      movb   $0x0,0x8(%rsp,%rax,1) # Null terminate


Length Validation (addresses 11e3-11fa):
assembly
11e3: e8 e8 fe ff ff                  call   10d0 <strlen@plt>         # Get string length
11e8: 48 83 f8 17                    cmp    $0x17,%rax              # Compare with 23 (0x17)
11ec: 74 0e                               je     11fc                              # Jump if equal to 23
11ee: 48 8d 3d 8f 0e 00 00     lea    0xe8f(%rip),%rdi       # "Wrong length" message
11f5: e8 c6 fe ff ff                    call   10c0 <puts@plt>            # Print error
11fa: eb 28                                jmp    1224                           # Exit


Key Discovery: The program requires exactly 23 characters (0x17 in hex).

### Step 8: Testing Length Requirement

I verified the length requirement:

bash
echo -n "12345678901234567890123" | wc -c  # Outputs: 23
echo -n "12345678901234567890123" | LD_PRELOAD=./bypass_ptrace.so ./day4


Output:
NPLD Mainframe Authentication
Enter access code: Access Denied. Jingle smirks.


Success! The length check passed, but content validation failed. This confirmed the 23-character requirement and revealed there's a 
content validation step.

### Step 9: Analysis of Validation Functions

I analyzed the validation functions called after length check:

bash
objdump -d day4 | grep -A 30 "1339:"

Main Validation Function (1362):
assembly
1362: f3 0f 1e fa                              endbr64
1366: 31 c0                                       xor    %eax,%eax              # Counter = 0
1368: 48 8d 0d a1 0d 00 00            lea    0xda1(%rip),%rcx    # Load reference string (0x2110)

# Main validation loop:
136f: 0f be 14 07             movsbl (%rdi,%rax,1),%edx      # Load input[i] (sign-extended)
1373: 0f b6 34 01            movzbl (%rcx,%rax,1),%esi       # Load reference[i] (zero-extended)
1377: 83 f2 42                  xor    $0x42,%edx                      # XOR input[i] with 0x42
137a: 39 f2                       cmp    %esi,%edx                       # Compare with reference[i]
137c: 75 0f                        jne    138d                                   # Jump if not equal (fail)
137e: 48 ff c0                   inc    %rax                                    # i++
1381: 48 83 f8 17           cmp    $0x17,%rax                       # Compare i with 23
1385: 75 e8                       jne    136f                                    # Continue loop if i < 23
1387: b8 01 00 00 00      mov    $0x1,%eax                       # Return 1 (success)
138c: c3                             ret
138d: 31 c0                       xor    %eax,%eax                       # Return 0 (failure)
138f: c3                             ret


Critical Algorithm Discovery:
1. Loop through each of the 23 input characters
2. XOR each input character with 0x42
3. Compare result with corresponding byte in reference string at address 0x2110
4. All 23 comparisons must match for success

### Step 10: Extracting the Reference String

I extracted the reference data from the binary's read-only data section:

bash
objdump -s -j .rodata day4 | grep -A 10 2110


Output:
2110 21312639 732c3672 1d362a71 1d2f7673  !1&9s,6r.6*q./vs
2120 2c243076 2f713f                      ,$0v/q?


Hex Data Extraction:
- Address 0x2110: 21 31 26 39 73 2c 36 72 1d 36 2a 71 1d 2f 76 73
- Address 0x2120: 2c 24 30 76 2f 71 3f
- Total: 23 bytes (exactly matching the required input length)

### Step 11: Decryption Algorithm Implementation

I implemented the reverse of the validation algorithm:

python
# Reference string from binary
ref_hex = "21312639732c36721d362a711d2f76732c243076" + "2f713f"
ref_bytes = bytes.fromhex(ref_hex)

print(f"Reference length: {len(ref_bytes)}")  # Verify 23 bytes

# Reverse the XOR operation: if (input XOR 0x42) == reference, 
# then input == (reference XOR 0x42)
decoded = [byte ^ 0x42 for byte in ref_bytes]
access_code = ''.join(chr(x) for x in decoded)

print(f"Decoded access code: {access_code}")


Mathematical Verification:
- Original validation: (input[i] XOR 0x42) == reference[i]
- Reverse operation: input[i] == (reference[i] XOR 0x42)
- XOR is its own inverse: (A XOR B) XOR B == A

Result: csd{1nt0_th3_m41nfr4m3}

### Step 12: Final Validation and Testing

I tested the decoded access code:

bash
echo -n "csd{1nt0_th3_m41nfr4m3}" | LD_PRELOAD=./bypass_ptrace.so ./day4


Output:
NPLD Mainframe Authentication
Enter access code: Welcome to the mainframe, Operative. Jingle owes the elves a round.


I also verified it works without the ptrace bypass:

bash
echo -n "csd{1nt0_th3_m41nfr4m3}" | ./day4


Same successful output! This confirmed the access code was correct and the binary's normal execution path worked properly.

### Step 13: Comprehensive Technical Summary

Security Mechanisms Encountered:
1. Anti-debugging via ptrace() - Detected and blocked debugging attempts
2. Symbol stripping - Removed function names and debug information
3. Anti-tampering check - Verified integrity using magic value 0xdeadbeef
4. Input validation - Required exact 23-character length
5. Encryption - XOR cipher with key 0x42

