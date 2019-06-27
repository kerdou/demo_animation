
// firefox empêche de jouer automatiquement des sons avant que le user ait cliqué au moins une fois sur la fenêtre
// pour contrer ce problème je fais popper une boite modale à cliquer qui déclenche tout le reste
var go = document.getElementById("gobutton").addEventListener("click", launcher);

// disparition de la boite modale
// opacité normale
// lancement de toutes les boucles
function launcher() {
    $('#popup').css('display','none');
    $('#container').css('opacity','1');
    cielLoop();
    missileLoop();
    tornado();
    collision();
}

// défilement du ciel
function cielLoop() {
    $("#skybox").animate({
        "background-position": "-=400px" // position initiale horizontale du ciel
    }, 2000, "linear", cielLoop); // délai de 2000ms avant de relancer la boucle
}

// positionnement des missiles et défilement
function missileLoop() {
    $("#missile").animate({
        right: '400px' // position initiale horizontale de l'avion
    }, 1100, "linear", function () { // délai de 1100ms entre 2 vagues de missile, animation linéaire
        var missileTopValue = (Math.floor((Math.random() * 356) + 22) + 'px'); // calcul de la position de départ du missile randomisée sur le plan vertical
        $("#missile").css({
            top: missileTopValue, // position vertical de l'avion suite au calcul
            right: '-150px' // pour coller le missile à droite de l'écran quand il apparait
        });
        missileLoop(); // relancement de la boucle d'animation du missile
    });
}

// gestion du déplacement de l'avion
function tornado() {
 
    var key; // valeur de la touche actuellement appuyée

    $(document).keydown(function (e) {
        key = e.key; // perception de la touche actuellement pressée et affectation de key
    });
    $(document).keyup(function () {
        key = null; // pas d'enregistrement pour key si aucune touche n'est enfoncée
    });

    setInterval(tornaMove, 16); //rafraichissement du déplacement de l'avion, définit sa vitesse de déplacement

    function tornaMove() {
        var tornaVertiPos = parseInt($('#tornado').css('top')); // récupération du top de l'emplacement de l'avion
        if ((key == 'ArrowUp') && (tornaVertiPos > 58)) { // butée haute de l'avion
            $("#tornado").animate({
                top: "-=6" // valeur pour annuler le mouvement vertical de l'avion une fois en butée
            }, 0);
        }
        if ((key == 'ArrowDown') && (tornaVertiPos < 342)) { // butée basse de l'avion
            $("#tornado").animate({
                top: "+=6" // valeur pour annuler le mouvement vertical de l'avion une fois en butée
            }, 0);
        }
    }
}

// test de collision entre l'avion et le missile
function collision() {
    setInterval(collitest, 20); // rafraichissement du test de collision, définit sa vitesse de déplacement

    function collitest() {
        var topGap = 0; // écart entre le tornaTop et le missiTop
        var tornaPos = $("#tornado").position(); // récup de la position de l'avion
        var missiPos = $("#missile").position(); // récup de la position du missile
        var tornaTop = parseInt(tornaPos.top); // récup du top de l'avion
        var missiTop = parseInt(missiPos.top); // récup du top du missile
        var missiLeft = parseInt(missiPos.left); // récup de la partie gauche du missile

        
        if ((missiLeft > 87) && (missiLeft < 150)) { // test de collision du nez de l'avion qui déclenche un DOH! en cas d'impact
            topGap = tornaTop - missiTop; // calcul de l'écart vertical entre l'avion et le missile
            if ((topGap < -16) && (topGap > -48)) { // trigger pour le déclenchement de la collision du nez
                $("audio")[1].play(); // déclenchement du DOH
            }
        }
        if (missiLeft < 86) { // si l'impact a lieu entre l'arriere de la verriere et les réacteurs on entend le beep.mp3
            topGap = tornaTop - missiTop; // calcul de l'écart vertical entre l'avion et le missile
            if ((topGap < 28) && (topGap > -92)) { // trigger pour le déclenchement de la collision du reste de l'avion
                $("audio")[0].play(); // déclenchement du beep.mp3
            }
        }
    }
}

// c'est à cause de ces event listeners qui ne se déclenchent pas sans clic sur firefox qu'il a fallu rajouter
// la fenetre à cliquer au chargement de la page
// sans eux, pas de sons et de décompte des collisions
window.addEventListener("load", function () {
    document.getElementById('boom').addEventListener("play", score); // 
    document.getElementById('boom').addEventListener("ended", stopblink); // 
});

// le nombre de morts s'incrémente de 1 quand l'évenement "play" du player audio avec l'id "boom" est lancé
function score() {
    var deathVal = parseInt($('#deathcount').val()); // récupération du nombre de morts actuellement affiché
    deathVal++; // décompte de morts
    $('#deathcount').val(deathVal); // affichage du nouveau nom de morts
    $("#tornado").addClass("clignote"); // ajout de la classe "clignote" sur l'avion sur l'avion
}

// suppression de la classe "clignote" sur l'avion quand l'évement "ended" du player audio avec l'id "boom" se produit
function stopblink() {
    $("#tornado").removeClass("clignote"); // supprime la classe "clignote" à l'avion
}


