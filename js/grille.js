/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {

  constructor(l, c) {
    this.lignes=l;
    this.colonnes=c;
    this.tabCookies = create2DArray(this.lignes);
    this.remplirTableauDeCookies(6);
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  animationjeu(cookiesCliquees,cookie){
    if(cookiesCliquees.includes(cookie)){
      cookie.deselectionnee();
      cookiesCliquees.pop();
    }
    else if(cookiesCliquees.length==1){
      this.swap(cookiesCliquees,cookie);
    }
    else {
      cookiesCliquees.push(cookie);
      cookie.selectionnee();
    }
  }

  /* effectue le swap des cookies qui se trouvent à proximité */
  swap(cookiesCliquees, cookie){
    let dist = Cookie.distance(cookiesCliquees[0], cookie);
    if(dist==1){
      Cookie.swapCookies(cookiesCliquees[0],cookie);
      cookie.deselectionnee();
      cookie.div.appendChild(cookie.htmlimage);
      let cook = cookiesCliquees.pop();
      cook.deselectionnee();
      cook.div.appendChild(cook.htmlimage);
      this.viderGrille();
    }
  }
  /* mise en place du bouton qui affiche les match */
  setupMarqueur(){
    let g = this;
    let marquer = document.getElementById("match");
    marquer.addEventListener("click", function(){
      g.detecterMatch3Colonnes();
      g.detecterMatch3Lignes();
    for( var i = 0;i<g.lignes;i++){
      for(var j = 0;j<g.colonnes;j++){
        if(g.tabCookies[i][j].marque)
        g.tabCookies[i][j].selectionnee();
      }
    }
  });
  }

  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");
    let cookiesCliquees = [];
    let g = this;
    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index/this.lignes);
      let colonne = index%this.lignes;

      //console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);
      let cookie = this.tabCookies[ligne][colonne];
      cookie.div = div;
      let img = cookie.htmlimage;
      // listeners sur le drag & drop
      div.addEventListener("dragstart", function(event){
        cookiesCliquees.push(cookie);
      });
      div.addEventListener("dragenter", function(event){
        event.preventDefault();
        var e = event.currentTarget;
        e.classList.add("grilleDragOver"); // on colore les cases qu'on survole en violet
      });
      div.addEventListener("dragover", function(event){
        event.preventDefault();
      });
      div.addEventListener("dragleave", function(event){
        event.preventDefault();
        var e = event.currentTarget;
        e.classList.remove("grilleDragOver");
      });
      div.addEventListener("drop", function(event){
        var e = event.currentTarget;
        e.classList.remove("grilleDragOver");
        g.swap(cookiesCliquees,cookie);
        cookiesCliquees = [];
      });

      // listener sur le click
      div.addEventListener("click", function(){
        g.animationjeu(cookiesCliquees,cookie);
        //console.log("Click cookie "+ ligne +" " +colonne);
      });
      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);
    });
  }


  
  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    for( var i = 0;i<this.lignes;i++){
      for(var j = 0;j<this.colonnes;j++){
        this.tabCookies[i][j] = new Cookie(Math.floor(nbDeCookiesDifferents*Math.random()),i,j);
      }
    }
  }

  /* lecture de chaque ligne pour trouver des matches de 3+ cookies */
  detecterMatch3Lignes() {
    var typecompt = -2;
    var tabelements = [];

    for( var i = 0;i<this.lignes;i++){
      for(var j = 0;j<this.colonnes;j++){
        if(this.tabCookies[i][j].type!=typecompt) {
          this.marquerCookies(tabelements);
          tabelements = [];
          typecompt = this.tabCookies[i][j].type;
        }
        if(this.tabCookies[i][j].type!=-1)
        tabelements.push(this.tabCookies[i][j]);
      }
      this.marquerCookies(tabelements);
      tabelements = [];
      typecompt = -2;
    }
  }

  /* lecture de chaque colonne pour trouver des matches de 3+ cookies */
  detecterMatch3Colonnes() {
    var typecompt = -2;
    var tabelements = [];

    for( var i = 0;i<this.colonnes;i++){
      for(var j = 0;j<this.lignes;j++){
        if(this.tabCookies[j][i].type!=typecompt) {
          this.marquerCookies(tabelements);
          tabelements = [];
          typecompt = this.tabCookies[j][i].type;
        }
        if(this.tabCookies[j][i].type!=-1)
        tabelements.push(this.tabCookies[j][i]);
      }
      this.marquerCookies(tabelements);
      tabelements = [];
      typecompt = -2;
    }
  }
  
  /* lis chaque cookie de la grille marqué et les supprime */
  viderCookies(){
    for( var i = 0;i<this.lignes;i++){
      for(var j = 0;j<this.colonnes;j++){
        if(this.tabCookies[i][j].marque)
          this.tabCookies[i][j].viderCookie();
      }
    }
  }

  /* vide la grille de tous les match après les avoir detecter */
  viderGrille(){
    this.resetMarqueurCookies();
    this.detecterMatch3Colonnes();
    this.detecterMatch3Lignes();
    this.viderCookies();
  }

  /* met le marqueur à faux avant la detection des match pour reset les actions du bouton */
  resetMarqueurCookies(){
    for( var i = 0;i<this.lignes;i++){
      for(var j = 0;j<this.colonnes;j++){
          this.tabCookies[i][j].marque = false;
          this.tabCookies[i][j].deselectionnee();
      }
    }
  }
  /* marque chaque cookie de la liste de potentiels match */
  marquerCookies(tabelements){
    if(tabelements.length>=3){
      for(var z = 0;z<tabelements.length;z++)
      tabelements[z].marquer();
    }
  }
}
