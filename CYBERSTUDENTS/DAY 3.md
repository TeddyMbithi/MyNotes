
Here is the challenge description:
![Image](../../images/Pasted image 20251221232236.png)

1️⃣ DMARC Record Leak

dig TXT _dmarc.krampus.csd.lol

DMARC revealed:

ruf=mailto:forensics@ops.krampus.csd.lol

→ Hidden subdomains discovered:

- `ops.krampus.csd.lol`
- `forensics.ops.krampus.csd.lol`

2️⃣ ops.krampus.csd.lol TXT Record

internal-services: _ldap._tcp.krampus.csd.lol _kerberos._tcp.krampus.csd.lol _metrics._tcp.krampus.csd.lol

→ Indicates Active Directory / Kerberos / internal monitoring.

3️⃣ SRV Records

dig SRV _metrics._tcp.krampus.csd.lol

Returned:

beacon.krampus.csd.lol:443

This is likely the C2 server.

4️⃣ Beacon TXT Record

dig TXT beacon.krampus.csd.lol

Output:

config=ZXhmaWwua3JhbXB1cy5jc2QubG9s==

Decode Base64:

exfil.krampus.csd.lol

5️⃣ exfil TXT Record

selector=syndicate

→ Indicates the DKIM selector.

6️⃣ DKIM TXT Record

dig syndicate._domainkey.krampus.csd.lol TXT

Returned Base64:

Y3Nke2RuNV9tMTlIVF9CM19LMU5ENF9XME5LeX0=

Decoded:

csd{dn5_m19HT_B3_K1ND4_W0NKy}

### Final Flag

csd{dn5_m19HT_B3_K1ND4_W0NKy}

Press enter or click to view image in full size

![](https://miro.medium.com/v2/resize:fit:700/1*yf11bQ-WDIZvVN1U9KthKw.png)

### DNS Chain Summary

krampus.csd.lol  
  └─> _dmarc (ruf field)  
      └─> ops.krampus.csd.lol  
          └─> _metrics._tcp SRV  
              └─> beacon.krampus.csd.lol  
                  └─> config (base64)  
                      └─> exfil.krampus.csd.lol  
                          └─> DKIM selector  
                              └─> syndicate._domainkey (FLAG!)