# Malware Analysis Report: SecretPictures

## 1. Executive Summary
This report details the static and dynamic analysis of a suspicious binary. The analysis confirms the file is a malware sample written in **Go (Golang)**. It exhibits typical persistence mechanisms by modifying the Windows Registry, attempts to evade detection by copying itself to a hidden directory, and initiates network connections to a known malicious domain.

## 2. File Identification
Initial static analysis was performed to identify the file's properties and compilation language.

*   **MD5 Hash**: `fd46d178474f32f596641ff0f7bb337e`
*   **Programming Language**: `GOLANG`

**Static Analysis Overview (Cutter):**
![Static Analysis Overview](../../images/Pasted%20image%2020251130123136.png)

## 3. Static Analysis
Further inspection of the binary's imports revealed specific API calls used for system reconnaissance.

### API Imports
The malware imports functions from `Kernel32.dll` to interact with the file system. Specifically, it utilizes **`GetDriveType`** (likely `GetDriveTypeA` or `GetDriveTypeW`) to enumerate and check the types of drives connected to the system.



## 4. Dynamic Analysis
Dynamic analysis was conducted using ANY.RUN to observe the malware's behavior in a controlled environment.

![ANY.RUN Analysis](../../images/Pasted%20image%2020251207191613.png)

### File System Artifacts
Upon execution, the malware copies itself to a specific directory to establish a foothold.
*   **Dropped Folder**: `Systemlogs`

### Persistence Mechanism
To ensure it runs automatically upon system reboot, the malware modifies the Windows Registry.
*   **Registry Key**: `HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`
*   **Value Name**: `HealthCheck`

**Registry Modification Evidence:**
![Registry Key Modification](../../images/Pasted%20image%2020251207192219.png)
![Persistence Entry](../../images/Pasted%20image%2020251207192706.png)

### Network Activity
The malware attempts to establish a connection to a remote command and control (C2) server.
*   **FQDN**: `malware.invalid.com`

**Network Traffic Analysis:**
![Network Connection](../../images/Pasted%20image%2020251207192742.png)

## 5. Indicators of Compromise (IOCs)

| Type | Value |
|------|-------|
| **MD5** | `fd46d178474f32f596641ff0f7bb337e` |
| **Domain** | `malware.invalid.com` |
| **File Path** | `Systemlogs` (Directory) |
| **Registry Key** | `HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run` |
| **Registry Value** | `HealthCheck` |

---



![Import Analysis](../../images/Pasted%20image%2020251207200950.png)



