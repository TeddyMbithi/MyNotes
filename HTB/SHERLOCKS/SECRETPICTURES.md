-  Loading up the binary in Cutter, we get this overview:
![[Pasted image 20251130123136.png]]

-  We immediately answer Task 1 and Task 2
		- What is the MD5 hash of the malware? fd46d178474f32f596641ff0f7bb337e
		- What programming language is used to write the malware? GOLANG
- Loading the file into ANY.RUN, ![[Pasted image 20251207191613.png]]

- From the AI summary, we get the Solution to task 3: ## What is the name of the folder the malware copies itself to after the initial run? Systemlogs
- Task 4 is to identify:
		- ## What registry key does the malware modify to achieve persistence?   
      HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
		- ![[Pasted image 20251207192219.png]] Add HealthCheck at the end for it name
		- ![[Pasted image 20251207192706.png]]
- Task 5 is ## What FQDN does the malware attempt to connect to?
	- ![[Pasted image 20251207192742.png]]
	- its malware.invalid.com
- Task 6 is Which Windows API function does the malware call to check drive types?
	- ### **Using a PE analysis tool (e.g., PEiD, PEview, CFF Explorer)**

	Look under: - **Import Table → Kernel32.dll**
    If you see **`GetDriveTypeA`** or **`GetDriveTypeW`**, that confirms the malware imports it.
	    In this case its GetDriveType.
	Thank you for Reading
	
	![[Pasted image 20251207195119.png]]
