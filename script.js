import * as fs from "https://cdn.jsdelivr.net/gh/smx-m14/js@main/firestore.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";

$(function () {
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#availabdiment, mostra la temperatura del processador i la memòria RAM del sistema.le-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyD7qeyLfcs-G2Ht08ZzGF11_AE2kyYX1yQ",
        authDomain: "hundir-la-flota-ed802.firebaseapp.com",
        projectId: "hundir-la-flota-ed802",
        storageBucket: "hundir-la-flota-ed802.firebasestorage.app",
        messagingSenderId: "1037807049478",
        appId: "1:1037807049478:web:654daaefabd1e656ed5c87",
        measurementId: "G-1FCW9F16H2"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    //Lo puedo eliminar, pero lo dejo ahi por el momento
    const analytics = getAnalytics(app);

    fs.prepareDatabase(firebaseConfig);

    var barcos = ["ninguno", "ninguno", "a", "b", "c"];
    var jugando = false;
    var personasListas = 0;
    var codigoDePartida;

    //Creamos los sonidos
    var selecionarBarco;
    var error;
    var impactoAgua;
    var impactoBarco;

    $("#Juego").hide();

    $("#barcos div").click(function () {
        $(".selecionado").removeClass("selecionado");
        $(this).toggleClass("selecionado");
        //selecionarBarco.play();
    });

    $("#entrarPartida").click(function() {
        if ($("#MenuInicio input").val() >= 100000) {
            $("#MenuInicio").hide();
            $("#Juego").show();
            codigoDePartida = $("#MenuInicio input").val();
        }
    });

    $("#crearPartida").click(async function () {
        $("#MenuInicio").hide();
        $("#Juego").show();
        codigoDePartida = randomBetween(100000, 999999);
        codigoDePartida = await crearPartida(codigoDePartida);
        /*fs.getCollection("partidas").then((col) => {
            
        });
        fs.getDocument("partidas", codigoDePartida).then((doc) => {
            while (doc != null) {
                
                codigoDePartida = randomBetween(100000, 999999);
                fs.saveDocument();
            }
            if (doc == null) {
                
            }
        });
        while (true) {
            fs.getDocument("partidas", codigoDePartida).then((doc) => {
                if (doc == null) {
                    codigoDePartida = randomBetween(100000, 999999);
                }
            });
        }*/
        $("#codigoPartida").text(codigoDePartida);
    });

    $("#jugar").click(async function () {
        if ($("#barcos div").length <= 0) {
            $("#jugar").hide();
            var doc = await fs.getDocument("partidas", codigoDePartida);
            personasListas = doc.personasListasJugar;
            personasListas++;
            console.log(personasListas)
            await fs.saveDocument("partidas", codigoDePartida, {
                personasListasJugar: personasListas,
            });
            console.log(personasListas);
            if (personasListas >= 2) {
                jugando = true;
            }
            $("#jugando").hide();
            var i = 1;
            $("#casillas div").each(function () {
                if ($(this).hasClass(`barco`)) {
                    var dividirClaseCasilla = $(this).attr("class").split("-");
                    var tipoDeBarco = dividirClaseCasilla[1];
                    $(`.barco-${tipoDeBarco}-${i}`).removeClass(`barco-${tipoDeBarco}-${i}`);
                    i++;
                }

                else {
                    i = 1;
                }
            });
        }
    });

    $(".casilla").click(function () {
        if ($(".selecionado").length >= 1) {

            var dividirClaseBarco = $(".selecionado").attr("class").split("-");
            var cantidadesDivisionesBarco = barcos.indexOf(dividirClaseBarco[1]);

            var casilla = $(this).attr("id").split("-");

            var puedoColocarBarco = comprobarColocarBarco(casilla[1], cantidadesDivisionesBarco);

            colocarBarco(puedoColocarBarco, casilla[1], dividirClaseBarco[1], cantidadesDivisionesBarco);

            /*var dividirBarco = $(".selecionado").attr("class");
            dividirBarco = dividirBarco.split("-");
            var cantidadDivisionesBarco = barcos.indexOf(dividirBarco[1]);
            var auxiliarDivisionesBarco = cantidadDivisionesBarco;
            var casilla = $(this).attr("id").split("-");
            var auxiliarCasilla = casilla[1];
            var casillaMinima = casilla[1];
            var casillaMaxima;
            var colocarBarco = true;
            while (auxiliarDivisionesBarco > 0) {
                if (auxiliarCasilla % 5 == 0) {
                    casillaMaxima = auxiliarCasilla;
                    auxiliarDivisionesBarco--;
                    if (auxiliarDivisionesBarco > 0) {
                        colocarBarco = false;
                        break;
                    }
                }
                auxiliarCasilla++;
                auxiliarDivisionesBarco--;
                console.log(auxiliarCasilla);
                console.log(auxiliarDivisionesBarco);
            }
            
            if (colocarBarco) {
                for (var i = 1; i <= cantidadDivisionesBarco; i++) {
                    $(`#c-${casilla[1]}`).addClass(`barco-${dividirBarco[1]}-${i}`);
                    $(`#c-${casilla[1]}`).addClass(`barco`);
                    casilla[1]++;
                }
                $(".selecionado").remove();
            }
            console.log(casilla);
            console.log(dividirBarco);*/
        }

        else if (jugando) {
            if ($(this).hasClass("barco")) {
                $(this).addClass("cruz-barco");
                //impactoBarco.play();
            }

            else {
                $(this).addClass("cruz-agua");
                //impactoAgua.play();
            }
        }
    });

    function comprobarColocarBarco(casillaActual, divisionesBarco) {
        var puedoColocarBarco = true;
        while (divisionesBarco > 0) {
            divisionesBarco--;
            if ($(`#c-${casillaActual}`).hasClass("barco")) {
                puedoColocarBarco = false;
                break;
            }
            else if (casillaActual % 5 == 0) {
                if (divisionesBarco > 0) {
                    puedoColocarBarco = false;
                    break;
                }
            }

            casillaActual++;
        }

        return puedoColocarBarco;
    }

    function colocarBarco(puedoColocarBarco, casillaActual, claseBarco, divisionesBarco) {
        if (puedoColocarBarco) {
            for (var i = 1; i <= divisionesBarco; i++) {
                $(`#c-${casillaActual}`).addClass(`barco-${claseBarco}-${i}`);
                $(`#c-${casillaActual}`).addClass(`barco`);
                casillaActual++;
            }
            $(".selecionado").remove();
        }

        else {
            $(".selecionado").removeClass("selecionado");
            //error.play();
        }
    }

    async function crearPartida(codigo) {
        var existePartida = false;
        existePartida = await comprobarSiExisteCodigo(codigo);

        while (existePartida) {
            codigo = randomBetween(100000, 999999);
            existePartida = await comprobarSiExisteCodigo(codigo);
        }

        if (!existePartida) {
            await fs.saveDocument("partidas", codigo, {
                codigoPartida: codigo,
                personasListasJugar: personasListas,
            });
            return codigo;
        }
    }

    async function comprobarSiExisteCodigo(codigo) {
        var doc = await fs.getDocument("partidas", codigo);

        if (doc == null) {
            return false;
        }

        else {
            return true;
        }
    }


    /*function comprobarSiExistePartida(codigo) {
        //Aqui consigo la colecion entera (de momento no se para que usar "col", esta ahi sin más)
        fs.getCollection("partidas").then((col) => {
            var doc = codigo;
            codigo = comprobarPartida(doc);
            crearPartida(codigo);
        });
    }


    //return true o false si existe o no
    function comprobarPartida(codigo) {
        fs.getDocument("partidas", codigo).then((doc) => {
            if (doc != null) {
                codigo = cambiarCodigo();
                return codigo;
            }
        });
    }

    function cambiarCodigo(codigo) {
        console.log("Hola");
        while (partidas.includes(codigo)) {
            codigo = randomBetween(100000, 999999);
        }
        return codigo;
    }

    function crearPartida(codigo) {
        fs.saveDocument("partidas", codigo, {
            codigoPartida: codigo,
        });
    }*/


    /*function comprobarSiExistePartida(codigo) {
        //Aqui consigo la colecion entera (de momento no se para que usar "col", esta ahi sin más)
        fs.getCollection("partidas").then((col) => {
            var doc = codigo;
            comprobarPartida(doc);
            while (existePartida) {
                codigo = randomBetween(100000, 999999);
                doc = codigo;
                existePartida = comprobarPartida(doc);
                console.log(existePartida);
            }

            crearPartida(codigo);
            //Si devuelve false creara la partida
            if (!existePartida) {
                crearPartida(codigo);
            }
        });
    }


    //return true o false si existe o no
    function comprobarPartida(codigo) {
        fs.getDocument("partidas", codigo).then((doc) => {
            if (doc != null) {
                codigo = cambiarCodigo();
            }
        });
    }

    function cambiarCodigo (codigo) {
        var nuevoCodigo = codigo;
        while (codigo != nuevoCodigo) {
            nuevoCodigo = randomBetween(100000, 999999);
        }
        return nuevoCodigo;
    }

    function crearPartida(codigo) {
        partidas.push(codigo);
        fs.saveDocument("partidas", codigo, {
            codigoPartida: codigo,
        });
    }*/
});