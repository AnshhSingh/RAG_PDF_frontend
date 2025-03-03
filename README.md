# Installation
Assuming you have git and and Nodejs installed 
- Follow backend [docs](https://github.com/AnshhSingh/RAG_PDF_Backend/blob/main/README.md) to setup the backend and generate ngrok link

  
### Clone the repo 
```
 git clone https://github.com/AnshhSingh/RAG_PDF_frontend
 ```
```
cd RAG_PDF_frontend
```
### Add URL
- open the .env file and add your ngrok link
- the final env should look like this make sure to remove the "/" from the end of url
  
```
REACT_APP_URL=https://yoururl.ngrok.free
```
### Install dependencies 

```
npm install
```
### Run the dev server
```
npm run start
```

