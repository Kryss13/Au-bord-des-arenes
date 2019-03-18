'use strict';

/*************************************************************************************************/
/* ***************************************** CLASS ********************************************* */
/*************************************************************************************************/
class Carousel {

  /**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 *
 * @callback moveCallBack
 * @param {number} index
 *
 */

  /**
   * [constructor description]
   * @param {HTML Element} element
   * @param {Object} options
   * @param {Object} [options.slidesToScroll = 1] [Nombre d'éléments à faire défiler]
   * @param {Object} [options.slidesVisible = 1] [Nombre d'éléments visibles dans un slide]
   * @param {boolean} [options.loop = false] [Doit t'on boucler en fin de carousel ?]
   * @param {boolean} [options.pagination = false] [Doit t'on faire une pagination ?]
   * @param {boolean} [options.navigation = true] [Doit t'on avoir la navigation ?]
   * @param {boolean} [options.infinite = false] [Doit t'on avoir le scroll infinie ?]
   * @param {boolean} [options.autoScrolling = false] [Doit t'on avoir le scrol automatique ?]
   */

  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({}, {
      slidesToScroll : 1, //option de base si occupe valeur n'est donnée
      slidesVisible : 1, //option de base si occupe valeur n'est donnée
      loop : false, //option de base si occupe valeur n'est donnée
      pagination : false, //option de base si occupe valeur n'est donnée
      navigation : true, //option de base si occupe valeur n'est donnée
      infinite : false, //option de base si occupe valeur n'est donnée
      autoScrolling : false //option de base si occupe valeur n'est donnée
    }, options)
    if (this.options.loop && this.options.infinite) {
      throw new Error('Un carousel ne peut être à la fois en boucle et en infinie')
    }
    let children = [].slice.call(element.children);//Récupération des enfants de l'element parent
    this.isMobile = false;//Permet de déterminer si nous sommes sur mobile ou non
    this.currentItem = 0; //Permet de sauvegarder l'item pour pouvoir faire next ou prev
    this.moveCallBacks = [];//Permet de sauvegarder les moveCallBack
    this.offset = 0;//Met une valeur par defaut pour gérer le cas de la pagination avec le scrool infinie

    // Modification du DOM
    this.root = this.createDivWithClass('carousel');//Création de la grande div englobante
    this.root.setAttribute('tabindex', '0');//Rajoute un attribut pour gérer la tabulation au clavier (tabindex rend un élément focussable)
    this.panorama = this.createDivWithClass('carousel_panorama');//Création de la div servant à faire le panorama
    this.root.appendChild(this.panorama);//Ajout de la div 'panorama' dans la div 'carousel'
    this.element.appendChild(this.root);//Ajour de la div carousel a la fin de la div #carousel1
    this.items = children.map((child) => {
      let item = this.createDivWithClass('carousel_item');
      item.appendChild(child);//Création d'une div pour gérer les enfants pour permettre de mieux styliser le carousel
      return item
    });
    if (this.options.infinite) {
      this.offset = this.options.slidesVisible + this.options.slidesToScroll;
      if (this.offset > children.length) {
        console.error("Vous n'avez pas assez d'éléments dans le carousel", element);
      }
      this.items = [
        ...this.items.slice(this.items.length - this.offset ).map(item => item.cloneNode(true)),//Permet de rajouter les items en fin de carousel
        ...this.items,
        ...this.items.slice(0, this.offset ).map(item => item.cloneNode(true)),//Permet de rajouter les items en debut de carousel
      ]
      this.goToItem(this.offset, false);
    }
    this.items.forEach(item => this.panorama.appendChild(item));//Ajout des enfants (le reste de la div avec l'image, le titre la description))
    this.setStyle();
    if (this.options.navigation) {
        this.createNavigation();
    }
    if (this.options.pagination) {
        this.createPagination();
    }
    if(this.options.autoScrolling){
      window.setInterval(this.next.bind(this), 5000);
    }

    // Evenements
    this.moveCallBacks.forEach(cb => cb(this.currentItem));
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.root.addEventListener('keyup', e => {
      if (e.key === 'ArrowRight' || e.key === 'Right') { //La deuzieme condition permet de gérer le cas internet explorer ou Edge
        this.next();
      }else if (e.key === 'ArrowLeft' || e.key === 'Left') {//La deuzieme condition permet de gérer le cas internet explorer ou Edge
        this.prev();
      }
    })
    if (this.options.infinite) { //Si l'option infinite est égal à true, on met une écoute sur la fin de la transition pour pouvoir excécuter la fonction qui reset l'infinie
      this.panorama.addEventListener('transitionend', this.resetInfinite.bind(this))
    }
  }

  /**
   * [setStyle description]
   * Applique les bonnes dimensions aux éléments du carousel
   */
  setStyle(){
    let ratio = this.items.length / this.slidesVisible; //Permet de calculer la taille des éléments visible
    this.panorama.style.width = (ratio * 100) + '%';
    this.items.forEach(item =>   item.style.width = ((100 / this.slidesVisible) / ratio) + '%');
  }

  /**
   * [createNavigation Permet de créer les flèches de navigation dans le DOM]
   *
   */
  createNavigation(){
    let nextButton = this.createDivWithClass('carousel_next');//Création de la div du bouton de navgation next
    let prevButton = this.createDivWithClass('carousel_prev');//Création de la div du bouton de navgation prev
    this.root.appendChild(nextButton);//Ajout de la div next
    this.root.appendChild(prevButton);//Ajout de la div prev
    nextButton.addEventListener('click', this.next.bind(this));//Ajout d'une écoute sur le bouton next
    prevButton.addEventListener('click', this.prev.bind(this));//Ajout d'une écoute sur le bouton prev
    if (this.options.loop === true) { //Si le loop est à true, on peut ne pas faire les écoutes
      return
    }
    this.onMove(index =>{
      if (index === 0) {
        prevButton.classList.add('carousel_prev_hidden');
      }else {
        prevButton.classList.remove('carousel_prev_hidden');
      }
      if (this.items[this.currentItem + this.slidesVisible] === undefined) {
        nextButton.classList.add('carousel_next_hidden');
      }else {
        nextButton.classList.remove('carousel_next_hidden');
      }
    })
  }

  /**
   * [createNavigation Permet de créer la pagination dans le DOM]
   *
   */
  createPagination(){
    let pagination = this.createDivWithClass('carousel_pagination');//Création de la div de pagination
    let buttons = []; //Création d'un tableau vide pour les boutons
    this.root.appendChild(pagination); //Ajout de la div pagination à mon élément racine
    for (let i = 0; i < (this.items.length - 2 * this.offset) ; i = i + this.options.slidesToScroll) {
      let button = this.createDivWithClass('carousel_pagination_button') //Création de mes boutons de pagination pour autant de slides dans mon carousel
      button.addEventListener('click', () => this.goToItem(i + this.offset)) //Ajoute une écoute sur chaque bouton et au clic se déplace sur l'item sélectionné
      pagination.appendChild(button);//Ajout de chaque bouton à ma div pagination
      buttons.push(button);//Ajout de chaque bouton au tableau boutonS pour pouvoir ensuite écouter le déplacement et savoir lequel est actif pour lui rajouter la class active
    }
    this.onMove(index => {
      let count = this.items.length - 2 * this.offset; //Permet de sauvegarder la valeur et évite le temps pour l'activation du premier bouton en cas de reset (scrool tout à droite du carousel)
      let activeButton = buttons[Math.floor(((index - this.offset) % count) / this.options.slidesToScroll)];
      if (activeButton) {
        buttons.forEach(button => button.classList.remove('carousel_pagination_button_active'));
        activeButton.classList.add('carousel_pagination_button_active');
      }
    })
  }

  next(){
    this.goToItem(this.currentItem + this.slidesToScroll);
  }

  prev(){
    this.goToItem(this.currentItem - this.slidesToScroll);
  }

  /**
   * [goToItem Permet de déplacer le carousel vers l'éléments ciblé]
   * @param  {number} index
   * @param  {boolean} [animation = true]
   */
  goToItem(index, animation = true){
    if (index < 0) {
      if (this.options.loop) {
        index = this.items.length - this.slidesVisible;
      } else {
        return
      }
    }else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) //la deuzieme condition permet d'éviter d'avoir un vide apres la derniere image
    {
      if (this.options.loop) {
          index = 0;
      } else {
        return
      }
    }
    let translateX = index * -100 / this.items.length;
    if (animation === false) {
      this.panorama.style.transition = 'none';
    }
    this.panorama.style.transform = 'translate3d(' + translateX + '% , 0, 0)';
    this.panorama.offsetHeight; // Force repaint (évite l'animation)
    if (animation === false) {
      this.panorama.style.transition = '';//Permet de rédéfinir l'animation à afficher
    }
    this.currentItem = index;
    this.moveCallBacks.forEach(cb => cb(index));
  }

  /**
   * [resetInfinite description] Déplace le panorama pour donner l'impression d'un slide infinie
   */
  resetInfinite(){
    //Si l'item courant est inferieur ou égal au nombre de scroll possible (donc le carousel est tout a gauche)
    if (this.currentItem <= this.options.slidesToScroll) {
      //Alors tu vas à l'item qui correspond à l'item courant auquel tu additiones le nombre d'element sur lequel tu soustrais deux fois l'offset. Et pour que cela soit invisible à l'utilisateur, l'animation est à false
      this.goToItem(this.currentItem + (this.items.length - 2 * this.offset), false);
    }
    //Ou alors si l'item courant est >= au nombre d'item courant - l'offset (donc le carousel est tout à droite)
    else if (this.currentItem >= this.items.length - this.offset) {
      //Alors tu vas à l'item qui correspond à l'item courant auquel tu soustrais le nombre d'element sur lequel tu soustrais deux fois l'offset. Et pour que cela soit invisible à l'utilisateur, l'animation est à false
      this.goToItem(this.currentItem - (this.items.length - 2 * this.offset), false)
    }

  }

  /**
   * [onMove description]
   * @param  {moveCallBacks} cb
   */
  onMove(cb){
    this.moveCallBacks.push(cb);
  }

  /**
   * [onWindowResize description] Permet de faire la partie responsive du slider
   */
  onWindowResize(){
    let mobile = window.innerWidth < 800;
    if (mobile !== this.isMobile) {
      this.isMobile = mobile;
      this.setStyle();
      this.moveCallBacks.forEach(cb => cb(this.currentItem));
    }
  }

  /**
   * [createDivWithClass description]
   * @param  {string} className
   * @returns {HTML Element}
   */
  createDivWithClass(className){
    let div = document.createElement('div');//Création de la div
    div.setAttribute('class', className);//Ajout de la class className à la div
    return div;
  }

  /**
   * [slidesToScroll description]
   * @return {number}
   */
  get slidesToScroll(){
    return this.isMobile ? 1 : this.options.slidesToScroll //Equivalent à faire un if isMobile = true tu retournes 1, else tu retournes this.options.slidesToScroll
  }

  /**
   * [slidesVisible description]
   * @return {number}
   */
  get slidesVisible(){
    return this.isMobile ? 1 : this.options.slidesVisible //Equivalent à faire un if isMobile = true tu retournes 1, else tu retournes this.options.slidesVisible
  }
}

let onReady = function () {
  new Carousel(document.querySelector('#carousel'),{
    slidesToScroll : 1,
    slidesVisible : 4,
    pagination : true,
    infinite : true,
    loop : false,
    autoScrolling : true
  })
}
/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/
if (document.readyState !== 'loading') {
  onReady();
}
document.addEventListener('DOMContentLoaded', onReady );
