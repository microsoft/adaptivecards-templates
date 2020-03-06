export default {
  appId: process.argv[2] === 'dev' ?
    "4803f66a-136d-4155-a51e-6d98400d5506" : 
    process.argv[2] === "staging" ? 
    "ed0125aa-a0c3-48d5-8e2f-cd05d858e7ef" : 
    "cc02a0f4-ef1b-4513-a431-9aca7b2f7fca"
};
