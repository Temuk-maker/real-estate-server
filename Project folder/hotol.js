const tovchluur = document.getElementById("goSearch");

if (tovchluur) {
    tovchluur.addEventListener("click", () => {
        window.location.href = "hotol2.html";
    });
}

// const zarnemehtovch = document.getElementById("gaar");
// if (zarnemehtovch){
//   tovchluur.addEventListener("click", () => { window.location.href = "zarnemeh.html"; });
// }

// aldaagui huwilbar
// const tovchluur = document.getElementById("goSearch");

// if (tovchluur) {
//     tovchluur.addEventListener("click", () => {
//         window.location.href = "hotol2.html";
//     });
// }

// const zarnemehtovch = document.getElementById("gaar");

// if (zarnemehtovch) {
//     zarnemehtovch.addEventListener("click", () => {
//         window.location.href = "zarnemeh.html";
//     });
// }

// bogino huwilbar selon GPT
const buttons = [
  { id: "goSearch", page: "hotol2.html" },
  { id: "zarnemeh", page: "zarnemeh.html" },
  { id: "Real Estate",
    action: () => {
      alert("Үл хөдлөх товч дарагдлаа!");
    }
  }
];

buttons.forEach(btn => {
  const el = document.getElementById(btn.id);
  if (el) {
    el.addEventListener("click", () => {
      window.location.href = btn.page;
    });
  }
});

// daraagiin surah zuil
  document.getElementById("testBtn").addEventListener("click", () => {
    alert("Үл хөдлөх товч дарагдлаа!");
  });
// dund zereg bogino huwilbar
// ["goSearch","gaar"].forEach((id,i)=>{
//   const el=document.getElementById(id);
//   el?.addEventListener("click",()=>location.href=["hotol2.html","zarnemeh.html"][i]);
// });

// hamgiin absolute bogino huwilbar:
// ["goSearch","gaar"].forEach((e,i)=>document.getElementById(e).onclick=()=>location=i?"zarnemeh.html":"hotol2.html");

// const gaaw = document.getElementById("gaar")
// if (gaaw) {
//     gaaw.addEventListener("click",()=> {
//         window.location.href = "Hotol2.html";
//     });
// }

// const sayHi = () => {
//   console.log("Сайн уу!");
// };

// sayHi(); // "Сайн уу!" гэж хэвлэнэ.

// () => { ... }
// → Энэ бол роботод юу хийхийг заасан заавар юм.

// console.log("Сайн уу!");
// → Энэ бол роботын хэлэх үг.

// sayHi();
// → Энэ бол роботоо ажиллуулж байгаа мөч юм.
// Зүйрлэвэл:
// Роботынхаа “ON” товчийг дарж байгаа гэсэн үг.

// () нь параметр (parameter) буюу функцийн орж ирэх утгуудыг хүлээж авдаг хэсэг.
// → Хоосон байх нь “энэ функц ямар ч оролт авахгүй” гэсэн үг.

// const sayHii = (name) => console.log("Сайн уу," + name + "!");
// sayHii("Temuk");
// // Сайн уу, Temuk! гэж хэвлэнэ.

// 

// Part 1
// const pizza = "🍕";

// const foods = ["🍕", "🍕", "🍔"];

// const pizzas = foods.filter((food) => {
//   if (food === pizza) {
//     return true;
//   } else {
//     return false;
//   }
// });

// console.log(pizzas);

// // part2
// const searchValue = "hat";

// const prods = [
//   {
//     name: "hat",
//     price: 10,
//   },
//   {
//     name: "shoes",
//     price: 1,
//   },
// ];

// const haits = prods.filter((prod) => {
//   if (prod.name === searchValue) {
//     return true;
//   } else {
//     return false;
//   }
// });
// console.log(haits);
