/* I denna fil finns en klass för att hantera API-förfrågningar mot server (servern är det backend som skapades i lektion 5).

Om ni vill starta precis denna kod måste ni först installera om node-paket och starta upp servern. Servern, såsom den ser ut i slutet av Lektion 6, finns i denna samma zip-fil. Om ni skulle köra denna kod mot backend såsom det såg ut efter Lektion 5, skulle det inte fungera, eftersom detta är koden såsom den ser ut efter Lektion 6 och några små förändringar gjordes även i servern under Lektion 6. 

Gör då följande här i VS Code: 
1. Öppna en terminal
2. Skriv "cd 02-todo/server" (utan citattecken) och sedan enter
3. Skriv "npm install" (utan citattecken) och sedan enter
3. Skriv "node app.js" (utan citattecken) och enter. 

Om servern startats korrekt syns nu texten "Server running on http://localhost:5000".

*/

/* För att skapa en klass används nyckelordet class följt av klassens namn. Klasser bör ha stor inledande bokstav och döpas enligt det som kallas PascalCase. Inga parenteser används vid skapande av en klass. */
class Api {
  /* Medlemsvariabel url, för att lagra en grund-url till servern. */
  url = "";

  /* När en instans av klassen skapas skickas url in som parametern */
  constructor(url) {
    /* Medlemsvariabeln url sätts till den sträng som man skickar in när man skapar en instans av klassen (det görs i script.js). Detta upplägg är för att göra denna klass generell. Tanken är att det ska gå att använda vår api-klass till olika HTTP-anrop, inte bara sådana för våran todo-applikation.   */
    this.url = url;
  }

  /* Metod för att hatera att skapa resurser (Create i CRUD). Motsvarar ett anrop med metoden POST.   
  
  Create = POST
  */
  create(data) {
    /* Konverterar inskickat JavaScriptobjekt, i detta fall är det en uppgift, till en sträng så att den kan skickas över HTTP. */
    const JSONData = JSON.stringify(data);
    /* Utskrift till logg för att se vad som ska skickas och vart det ska skickas */
    console.log(`Sending ${JSONData} to ${this.url}`);

    /* Nedan skapas ett requestobjekt. Requestobjekt finns inbyggda i JavaScript tack vare JavaScripts fetch API. 

    Till request-objektets konstruktor skickas
    1. URL:en dit man vill göra förfrågan. I vårt fall det som man skickade in när klassen skapades och som lagrades i medlemsvariabeln this.url. 
    2. Ett objekt med konfiguration rörande förfrågan. 

    Objektet har följande egenskaper:
    
    method, som har satts till "POST". Eftersom vi här ska skapa något så är POST den metod man vill ha. 

    body, som har satts till den sträng som skapades utifrån det objekt som skickades in så att innehållet - body - i förfrågan kommer att innehålla en strängrepresentation av det som vi vill skapa. I fallet med vår todo-applikaiton kommer det att vara den uppgift som vi vill spara till servern. 

    headers, som är metadata som beskriver olika saker om själva förfrågan. Headers skickas in i form av ett JavaScript-objekt det också och här sätts egenskapen content-type för att beskriva på vilket sätt data är formaterat så att servern vet hur det ska avkodas när det packas upp på serversidan. 
      
    */
    const request = new Request(this.url, {
      method: "POST",
      body: JSONData,
      headers: {
        "content-type": "application/json",
      },
    });

    /* JavaScripts inbyggda funktion fetch är det som används för att göra HTTP-anrop. Fetch tar ett requestobjekt som parameter. Här skickar vi in det requestobjekt som vi skapade direkt ovanför.  */

    /* Fetch är inbyggt i JavaScript och används för HTTP-kommunikation till andra servrar, för att t.ex. hämta data. Här använder vi */
    return (
      /* Fetch är asynkron och vi bearbetar förfrågan och svar i flera olika steg med hjälp av then. Slutligen, när hela "then"-kedjan är färdig, kommer resultatet av det hela att returneras ur denna create-metod. Det är därför hela fetch och alla dess then är omslutna av parenteser och står efter return. Man returnerar alltså hela det uttrycket ut ur metoden.  */
      fetch(request)
        /* När förfrågan skickats kommer först ett svar i ett oläsbart format. Det tas här emot i en parameter som kallas result, så det avkodas med hjälp av metoden json som finns på result-objektet. result.json() är också asynkrion */
        .then((result) => result.json())
        /* Output från result.json() bearbetas genom att det bara tas emot och skickas vidare (data) => data är en förkortning av function(data) {return data}, där data då alltså är resultatet av den asynkrona metoden result.json(). */
        .then((data) => data)
        /* Om något i förfrågan eller svaret går fel, fångas det upp här i catch, där information om felet skrivs ut till loggen.  */
        .catch((err) => console.log(err))
    );
  }

  /* Read - GET */
  getAll() {
    /* I detta fetch-anrop behövs inga särskilda inställningar. Fetch kan ta bara url:en som parameter också, istället för att man skapar ett helt request-objekt och skickar in det. */
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  /* Delete = DELETE. Här heter dock metoden som hanterar DELETE-förfrågan "remove". delete får inte användas som metod- funktions- eller variabelnamn i JavaScript, då det är ett ord reserverat av JavaScript-språket självt.  */
  remove(id) {
    /*  Innan ni går vidare med remove, så måste ni se till att server-koden från L5 har en sak från L5 fixad: 
      I server/app.js ska  
        res.header('Access-Control-Allow-Method', '*') 
      ha ändrats till till 
        res.header('Access-Control-Allow-Methods', '*'); (Method->Methods, alltså)  */

    /* Log för att se att rätt uppgift är på väg att tas bort */
    console.log(`Removing task with id ${id}`);

    /* Här behövs, precis som vid POST, lite mer inställningar. Fetch behöver dock inte heller här ett requestobjekt. Det går bra att skicka de sakerna som man skulle ha skickat till requestobjektets konstruktor direkt till fetch-funktionen. 

    Det som skickas in som förfrågan är alltså url, som första argument och en uppsättning inställningar i ett objekt, som andra argument. Precis som när POST-requesten skapades ovan, i create ovan. 

    Det enda som finns i objektet, som skickas in som andra argument till fetch, är att sätta method till delete, eftersom det är den HTTP-metoden som ska användas här. 

    Egentligen skulle jag ha kunnat satt exakt samma kedja av then-anrop här som vid create (POST) och getAll (READ), men det är inte helt relevant vad som kommer till baka från ett delete-anrop. 
    */

    return fetch(`${this.url}/${id}`, {
      method: "DELETE",
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  /***********************Labb 2 ***********************/
  /* Här skulle det vara lämpligt att skriva en metod likt getAll, create och delete anropas från script.js när någon har markerat en uppgift som färdig. Denna metod bör ansvara för att göra en PUT eller PATCH-förfrågan till vårt backend, precis som create-metoden ansvarar för att göra ett POST-anrop. Metoden här ska alltså motsvara Update = PUT/PATCH. En sådan förfrågan görs med hjälp av fetch(). 
  
  Beroende på om ni gör frontend eller backend först i labben behöver ni på något av ställena bestämma er för en av metoderna PUT eller PATCH för denna förfrågan. (Du får välja själv, läs på om vad som verkar mest vettigt för din lösning). Använder du metoden PATCH här behöver i alla fall det vara patch som tas emot i servern också, app.patch(...), och vice versa om du väljer PUT. 
  */
  update(id, data) {
    console.log("Update metoden");
    let JSONData = JSON.stringify(data);
    console.log("JSONData:", JSONData);
    return fetch(`${this.url}/${id}`, {
      method: "PATCH",
      body: JSONData,
      headers: {
        "content-type": "application/json",
      },
    });
  }
  /*   
  För att utföra en förfrågan med hjälp av fetch() behöver servern veta några saker om förfrågan (request). Först och främst behövs en url dit förfrågan ska skickas, sedan behövs också ett objekt med inställningar och detaljer om förfrågan, detta objekt kallas vidare "{options}". Url och {options} kan sättas antingen i ett requestobjekts konstruktor; new Request(url, {options}), såsom det görs i create-metoden. Eller så skulle man kunna ange allt som annars skulle ha skickats till Request-objektets konstruktor inom parenteserna hos fetch() istället; fetch(url, {options})
  
  Här finns mer info om fetch-metoden: 
  https://developer.mozilla.org/en-US/docs/Web/API/fetch.
  */

  /* Precis som vid create behöver även här {options} innehålla egenskapen body - dvs. de data som ska skickas till server. */

  /* Det finns några sätt att utforma det som ska skickas i förfrågans body. Oavsett vad vi väljer ska det först översättas till JSON. 
  
  Alternativ 1: body består av ett helt task-objekt, som också inkluderar förändringen. Exempel: {id: 1,  title: "x", description: "x", dueDate: "x", completed: true/false}
  Alternativ 2: request-objektets body består bara av förändringarna och vilken uppgift som ska förändras. Exempel: {id: 1, completed: true/false }
  
  Om du hittar något annat sätt som funkar för dig, använd för all del det, så länge det uppnår samma sak. :)
  
  */

  /***********************Labb 2 ***********************/
}
