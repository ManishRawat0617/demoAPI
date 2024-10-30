const jwt = require("jsonwebtoken");
const secretKey = "Manish Rawat";

const user = {
  email: "manishrawat@1331@gmail.com",
  id: "sdd32e432qs2324w",
};

// const token = jwt.sign(user, secretKey, { expiresIn: "3s" });
const token = jwt.sign(user, secretKey, { expiresIn: "3s" });
console.log(token);

console.log("Theses are the details of the user ");
function print() {
  setTimeout(() => {
    const details = jwt.verify(token, secretKey);
    try {
      console.log(details);
    } catch (error) {
      console.log("Json Token expires ");
    }
  }, 4000);
}
print();
