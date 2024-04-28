// Seleciona un numero random entre dos valores dados.
function randomNumberBetween(min, max) {
   return Math.floor(Math.random() * (max - min) + min);
}

// Boton de Buscar y sección de resultados
const searchButton = document.getElementById("btn-search");
const searchButtonRandom = document.getElementById("btn-random");
const inputRating = document.querySelector('input[type="range"]');
const sect = document.getElementById("sect");

let ratingValue = 2150;
inputRating.addEventListener("input", (event) => {
   ratingValue = event.target.value;
   document.getElementById("rating-num").innerHTML = ratingValue;
});

searchButton.addEventListener("click", (event) => {
   searchProblem();
   event.preventDefault();
});

searchButtonRandom.addEventListener("click", (event) => {
   searchProblemRandom();
   event.preventDefault();
});

function searchProblemRandom() {
   // Petición a problemas de codeforces
   fetch("https://codeforces.com/api/problemset.problems")
      .then((response) => response.json())
      .then((data) => {
         // Comprobamos si la petición a salido bien
         if (data?.status != "OK") return;

         // Obtenemos el Obj de problemas y selecionamos el input
         const problems = data.result.problems;
         let randomIndex = randomNumberBetween(0, Object.keys(problems).length);
         result = problems[randomIndex];

         // Seleciona el boton de Go, añade el sontenido en el section, y genera la URl del probelma.
         sect.innerHTML = `
         <h2 class="problem-title">${result?.name}</h2>
         <h3 class="problem-value">Tags: ${result?.tags}</h3>
         <h3 class="problem-value">Rating:  ${result?.rating}</h3>
         `;

         document.getElementById("go").href = `https://codeforces.com/problemset/problem/${result?.contestId}/${result?.index}`;
      });
}

function searchProblem() {
   // Seleciona el value de el selecionado
   let text = tags.options[tags.selectedIndex].value;
   if (text == "" || ratingValue.value == "") return;

   // Petición a problemas de codeforces
   fetch(`https://codeforces.com/api/problemset.problems?tags=${text}`)
      .then((response) => response.json())
      .then((data) => {
         // Comprobamos si la petición a salido bien
         if (data?.status != "OK") return;

         // Obtenemos el Obj de problemas y selecionamos el input
         const problems = data.result.problems;

         // Se filtra por rating en base 10, de los rangos selecionados.
         let result = problems.filter((element) => {
            console.log(element?.rating, ratingValue);
            return element?.rating <= ratingValue;
         });

         result.sort((a, b) => b.rating - a.rating);

         // Añadimos el contenido en el section, y generamos la URl del problema.
         sect.innerHTML = `
            <h3 class="problem-title">${result[0].name}</h2>
            <p class="problem-value">
               Tags: ${result[0].tags}</p>
               Rating:  ${result[0].rating}
            </p>
         `;

         document.getElementById("go").href = `https://codeforces.com/problemset/problem/${result[0]?.contestId}/${result[0]?.index}`;
      });
}
