Example how to use session in NestJS framework

How to login with curl

Request  
`curl -v -X POST http://localhost:3002/api/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"`

Response
```text
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 3002 (#0)
> POST /api/login HTTP/1.1
> Host: localhost:3002
> User-Agent: curl/7.61.1
> Accept: */*
> Content-Type: application/json
> Content-Length: 44
> 
* upload completely sent off: 44 out of 44 bytes
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Content-Type: text/html; charset=utf-8
< Content-Length: 5
< ETag: W/"5-Jzb6spHwTmm2LUkMPAk2H1uCRho"
< Set-Cookie: connect.sid=s%3AOwk8N-q_I_DX7efGAdvNyqYIbgwDal5U.Hwu63IrNprrhAzqAiKgQCn6pk2O5%2FhqyKr%2BgqiOJH3c; Path=/; HttpOnly
< Date: Mon, 22 Jul 2019 08:54:37 GMT
< Connection: keep-alive
< 
* Connection #0 to host localhost left intact
```

How to call secure route  
Copy `connect.sid=s%3AOwk8N-q_I_DX7efGAdvNyqYIbgwDal5U.Hwu63IrNprrhAzqAiKgQCn6pk2O5%2FhqyKr%2BgqiOJH3c` and set `Cookie` header

Request  
`curl -v http://localhost:3002/api/me -H "Cookie: connect.sid=s%3AOwk8N-q_I_DX7efGAdvNyqYIbgwDal5U.Hwu63IrNprrhAzqAiKgQCn6pk2O5%2FhqyKr%2BgqiOJH3c"`

Response ( return current user from session )
```text
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 3002 (#0)
> GET /api/me HTTP/1.1
> Host: localhost:3002
> User-Agent: curl/7.61.1
> Accept: */*
> Cookie: connect.sid=s%3AOwk8N-q_I_DX7efGAdvNyqYIbgwDal5U.Hwu63IrNprrhAzqAiKgQCn6pk2O5%2FhqyKr%2BgqiOJH3c
> 
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 30
< ETag: W/"1e-KGbtWUKBzlWSfa9bBwEC8e/mZMk"
< Date: Mon, 22 Jul 2019 08:56:05 GMT
< Connection: keep-alive
< 
* Connection #0 to host localhost left intact
{"userId":1,"username":"john"}
```
