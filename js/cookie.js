class Cookie {
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];
  constructor(type, ligne, colonne) {
    this.marque = false; // marqueur pour savoir si le cookie est candidat à disparaitre
    this.div = null; // div qui contient le cookie sur le html
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;
    this.htmlimage = document.createElement("img");
    this.htmlimage.src= Cookie.urlsImagesNormales[this.type];
    this.htmlimage.dataset.ligne=this.ligne;
    this.htmlimage.dataset.colonne=this.colonne;
    this.htmlimage.height=80;
    this.htmlimage.width=80;
  }
  /* met en gros le cookie */
  selectionnee() {
    this.htmlimage.classList.add("cookies-selected");
  }

  /* met en petit le cookie après l'avoir selectionnée */
  deselectionnee() {
    this.htmlimage.classList.remove("cookies-selected")
  }

  /* marque le cookie pour disparition */
  marquer(){
    this.marque = true;
  }

  /* fait disparaitre le cookie en mettant une image vide */
  viderCookie(){
    this.htmlimage.src="./assets/images/Tile@2x.png";
    this.type = -1;
    this.marque= false;
    this.htmlimage.width=85;
    this.div.appendChild(this.htmlimage);
  }

  /* echange la place de 2 cookies */
  static swapCookies(c1, c2) {
    //console.log("SWAP C1 C2");
    //images et types temporaires
    let htmlimag = c2.htmlimage;
    let typet = c2.type;

    c2.htmlimage = c1.htmlimage;
    c2.type = c1.type;
    c1.htmlimage = htmlimag;
    c1.type=typet;
  }

  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    //console.log("Distance = " + distance);
    return distance;
  }
}
