/**
 * Created by Adrian on 01.04.2018.
 */

var app = angular.module('app',[]);


app.controller('mainController',function ($scope, $http) {

    $scope.passwords = [];
    $http.get('./PHP/getPasswords.php').then(function (response) {
        $scope.passwords = response.data;
    });
    $scope.prices = ['2000','350','250','1500','NAGRODA','200','150','250','500','BANKRUT','400','1000','250','STOP','400','200','WYCIECZKA','5000','150','250','300','150','200','BANKRUT'];
    $scope.finalPrices = ['10000','15000','25000','50000','WYCIECZKA','SAMOCHOD','MOTOR'];
    $scope.className = null;
    $scope.actualPrice = 'Zacznij!';
    $scope.numberOfPlayers = 1;
    $scope.actualPassword = null;
    $scope.fullActualPassword = null;
    $scope.actualPlayer = 1;
    $scope.letterChallenger = 0;
    $scope.openCompetitors =0;
    $scope.player1Avard = {money:0,material:[]};
    $scope.player2Avard = {money:0,material:[]};
    $scope.player3Avard = {money:0,material:[]};
    $scope.player4Avard = {money:0,material:[]};
    $scope.savedLetters = [];
    $scope.numberRound = 1;
    $scope.prohibitedLetters = ['e','y','i','a'];
    $scope.usedPasswords = [];
    $scope.playerWinners = '';
    $scope.counter = 20;
    $scope.finalPasswordAnswer = false;
    $scope.playerStats = {
        player1:{money:0,material:[]},
        player2:{money:0,material:[]},
        player3:{money:0,material:[]},
        player4:{money:0,material:[]}};

    $scope.initFunction = function(){
        $('.player1').addClass('player1Active');
        $('.player2').addClass('player2NotActive');
        $('.player3').addClass('player3NotActive');
        $('.player4').addClass('player4NotActive');
    };
    window.onload = $scope.initFunction();

    $scope.openNewGame = function () {
        $('.newGame-page').show('slide',1000);
    };

    $scope.closeNewGame = function () {
        $('.newGame-page').hide('blind',1000);
    };

    $scope.newGame = function () {
        $scope.player1Avard = {money:0,material:[]};
        $scope.player2Avard = {money:0,material:[]};
        $scope.player3Avard = {money:0,material:[]};
        $scope.player4Avard = {money:0,material:[]};
        $scope.savedLetters = [];
        $scope.numberRound = 1;
        $scope.usedPasswords = [];
        $scope.playerStats = {
            player1:{money:0,material:[]},
            player2:{money:0,material:[]},
            player3:{money:0,material:[]},
            player4:{money:0,material:[]}};
        $scope.className = null;
        $scope.actualPrice = 'Zacznij!';
        $scope.numberOfPlayers = 1;
        $scope.actualPassword = null;
        $scope.fullActualPassword = null;
        $scope.actualPlayer = 1;
        $scope.letterChallenger = 0;
        $scope.openCompetitors =0;
        $scope.playerWinners = '';
        $scope.counter = 20;
        $scope.finalPasswordAnswer = false;
        $('.welcome-page').show('slide',1000);
        setTimeout(function () {
            $('.newGame-page').hide('blind',1000);
            $('.winnerRoundsPage').hide('blind',1000);
        },1000);

    };

    $scope.createPlayerPanels = function () {
        switch($scope.numberOfPlayers){
            case 1:
                $scope.numberOfPlayers = 1;
                break;
            case 2:
                $scope.numberOfPlayers = 2;
                break;
            case 3:
                $scope.numberOfPlayers = 3;
                break;
            case 4:
                $scope.numberOfPlayers = 4;
                break;
        }
    };

    $scope.openCloseCompetitors = function () {
        if($scope.openCompetitors ==0){
            $('.competitors-mobile').show('blind',1000);
            $scope.openCompetitors++;
        } else {
            $('.competitors-mobile').hide('blind',1000);
            $scope.openCompetitors = 0;
        }
    }

    $scope.circle = function () {
        if($scope.className!=null){
            $scope.deleteClasses();
        }
        document.getElementById('spin').disabled = true;
        document.getElementById('check').disabled = false;
        document.getElementById('letter').disabled = false;
        document.getElementById('spin-mob').disabled = true;
        document.getElementById('check-mob').disabled = false;
        document.getElementById('letter-mob').disabled = false;
        setTimeout(function () {
            var price  = Math.floor(Math.random()*24);
            var className = 'rotate'+price;
            $scope.className = className;
            $scope.circleCircle();
            setTimeout(function () {
                $('#circleFortune').addClass(className);
                $('#circleFortune-mob').addClass(className);
                $scope.actualPrice = $scope.prices[23-price];
                if($scope.prices[23-price].toLowerCase() == 'bankrut'){
                    document.getElementById('spin').disabled = false;
                    document.getElementById('check').disabled = true;
                    document.getElementById('letter').disabled = true;
                    document.getElementById('spin-mob').disabled = false;
                    document.getElementById('check-mob').disabled = true;
                    switch($scope.actualPlayer){
                        case 1:
                            $scope.player1Avard.money =0;
                            $scope.player1Avard.material = [];
                            break;
                        case 2:
                            $scope.player2Avard.money =0;
                            $scope.player2Avard.material = [];
                            break;
                        case 3:
                            $scope.player3Avard.money =0;
                            $scope.player3Avard.material = [];
                            break;
                        case 4:
                            $scope.player4Avard.money =0;
                            $scope.player4Avard.material = [];
                            break
                    }
                    $('.password-block').css('border','2px solid red');
                    $scope.changePlayer();
                } else if($scope.prices[23-price].toLowerCase() === 'stop'){
                    $scope.changePlayer();
                    document.getElementById('spin').disabled = false;
                    document.getElementById('check').disabled = true;
                    document.getElementById('letter').disabled = true;
                    document.getElementById('spin-mob').disabled = false;
                    document.getElementById('check-mob').disabled = true;
                }
            },2000);
            setTimeout(function () {
                if($scope.actualPrice != 'BANKRUT' || $scope.actualPrice != 'NAGRODA' || $scope.actualPrice != 'STOP' || $scope.actualPrice != 'WYCIECZKA'){
                    document.getElementsByClassName('actualPriceText')[0].innerText = $scope.actualPrice + ' zł';
                } else{
                    document.getElementsByClassName('actualPriceText')[0].innerText = $scope.actualPrice;
                    $scope.letterEnabled = false;
                    $scope.spinEnabled = true;
                }
            },3000);
        },100);
    };

    $scope.checkSingleLetter = function (letter) {
        document.getElementById('spin').disabled = false;
        document.getElementById('check').disabled = true;
        document.getElementById('letter').disabled = true;
        document.getElementById('spin-mob').disabled = false;
        document.getElementById('check-mob').disabled = true;
        document.getElementById('letter-mob').disabled = true;
        for(var i=0;i<$scope.actualPassword.length;i++){
            for(var n=0;n<$scope.actualPassword[i].length;n++){
                if(letter.toLowerCase() == $scope.actualPassword[i][n].toLowerCase()){
                    $('#square'+i+n).addClass('checked');
                    $('#square'+i+n).addClass('discover');
                    $('.password-block').css('border','4px solid lightgreen');
                    $('#square'+i+n).html(letter);
                    $scope.letterChallenger++;
                    $scope.savedLetters.push(letter.toLowerCase());
                }
            }
        }
        if($scope.letterChallenger>0){
            if(!isNaN(parseFloat($scope.actualPrice))){
                switch($scope.actualPlayer){
                    case 1:
                        $scope.player1Avard.money += parseFloat($scope.letterChallenger) * parseFloat($scope.actualPrice);
                        break;
                    case 2:
                        $scope.player2Avard.money += parseFloat($scope.letterChallenger) * parseFloat($scope.actualPrice);
                        break;
                    case 3:
                        $scope.player3Avard.money += parseFloat($scope.letterChallenger) * parseFloat($scope.actualPrice);
                        break;
                    case 4:
                        $scope.player4Avard.money += parseFloat($scope.letterChallenger) * parseFloat($scope.actualPrice);
                        break;
                }
            } else if($scope.actualPrice.toLowerCase() == 'nagroda' || $scope.actualPrice.toLowerCase() == 'wycieczka'){
                switch($scope.actualPlayer){
                    case 1:
                        $scope.player1Avard.material.push($scope.actualPrice);
                        break;
                    case 2:
                        $scope.player2Avard.material.push($scope.actualPrice);
                        break;
                    case 3:
                        $scope.player3Avard.material.push($scope.actualPrice);
                        break;
                    case 4:
                        $scope.player4Avard.material.push($scope.actualPrice);
                        break;
                }
            }
        }
        if($scope.letterChallenger===0){
            $('.password-block').css('border','4px solid red');
            $scope.changePlayer();
        }
        $scope.letterChallenger=0;

    };


    $scope.checkLetter = function () {
        var right = true;
        var notRight = false;
        var letter = document.getElementById('letter').value;
        for(var i=0;i<$scope.savedLetters.length;i++){
            if(letter.toLowerCase() == $scope.savedLetters[i]){
                notRight = true;
                right = false;
            }
        }
        for(var n=0;n<$scope.prohibitedLetters.length;n++){
            if(letter.toLowerCase() == $scope.prohibitedLetters[n]){
                notRight = true;
                right = false;
            }
        }
        if(right == true){
           $scope.checkSingleLetter(letter);
        }
        else{
            document.getElementById('spin').disabled = false;
            document.getElementById('check').disabled = true;
            document.getElementById('letter').disabled = true;
            document.getElementById('spin-mob').disabled = false;
            document.getElementById('check-mob').disabled = true;
            document.getElementById('letter-mob').disabled = true;
            $('.password-block').css('border','4px solid red');
            $scope.changePlayer();
        }
    };

    $scope.checkBuyLetter = function(){
        var letter = document.getElementById('bought-letter').value;
        switch($scope.actualPlayer){
            case 1:
                if($scope.player1Avard.money>200){
                    $scope.player1Avard.money = parseFloat($scope.player1Avard.money)- 200;
                    $scope.closeBuy();
                    setTimeout(function () {
                        $scope.checkSingleLetter(letter);
                    },1000);
                } else {
                    $scope.closeBuy();
                    setTimeout(function () {
                        $('.error-site').show('blind',1000);
                    })
                }
                break;
            case 2:
                if($scope.player2Avard.money>200){
                    $scope.player2Avard.money = parseFloat($scope.player2Avard.money)- 200;
                    $scope.closeBuy();
                    setTimeout(function () {
                        $scope.checkSingleLetter(letter);
                    },1000);
                }else {
                    $scope.closeBuy();
                    setTimeout(function () {
                        $('.error-site').show('blind',1000);
                    })
                }
                break;
            case 3:
                if($scope.player3Avard.money>200){
                    $scope.player3Avard.money = parseFloat($scope.player3Avard.money)- 200;
                    $scope.closeBuy();
                    setTimeout(function () {
                        $scope.checkSingleLetter(letter);
                    },1000);
                }else {
                    $scope.closeBuy();
                    setTimeout(function () {
                        $('.error-site').show('blind',1000);
                    })
                }
                break;
            case 4:
                if($scope.player4Avard.money>200){
                    $scope.player4Avard.money = parseFloat($scope.player4Avard.money)- 200;
                    $scope.closeBuy();
                    setTimeout(function () {
                        $scope.checkSingleLetter(letter);
                    },1000);
                }else {
                    $scope.closeBuy();
                    setTimeout(function () {
                        $('.error-site').show('blind',1000);
                    })
                }
                break;
        }

    };

    $scope.changePlayer = function () {
        switch($scope.numberOfPlayers){
            case 1:
                $scope.actualPlayer = 1;
                break;
            case 2:
                var active = 'player'+$scope.actualPlayer+'Active';
                var notActive = 'player'+$scope.actualPlayer+'NotActive';
                $('.player'+$scope.actualPlayer).removeClass(active);
                $('.player'+$scope.actualPlayer).addClass(notActive);
                $scope.actualPlayer++;
                if($scope.actualPlayer>2){
                    $scope.actualPlayer =1;
                    var PlayerActive = 'player'+$scope.actualPlayer+'Active';
                    var PlayerNotActive = 'player'+$scope.actualPlayer+'NotActive';
                    $('.player'+$scope.actualPlayer).removeClass(PlayerNotActive);
                    $('.player'+$scope.actualPlayer).addClass(PlayerActive);
                } else{
                    var PlayerActive2 = 'player'+$scope.actualPlayer+'Active';
                    var PlayerNotActive2 = 'player'+$scope.actualPlayer+'NotActive';
                    $('.player'+$scope.actualPlayer).removeClass(PlayerNotActive2);
                    $('.player'+$scope.actualPlayer).addClass(PlayerActive2);
                }
                break;
            case 3:
                var active = 'player'+$scope.actualPlayer+'Active';
                var notActive = 'player'+$scope.actualPlayer+'NotActive';
                $('.player'+$scope.actualPlayer).removeClass(active);
                $('.player'+$scope.actualPlayer).addClass(notActive);
                $scope.actualPlayer++;
                if($scope.actualPlayer>3){
                    $scope.actualPlayer =1;
                    var PlayerActive = 'player'+$scope.actualPlayer+'Active';
                    var PlayerNotActive = 'player'+$scope.actualPlayer+'NotActive';
                    $('.player'+$scope.actualPlayer).removeClass(PlayerNotActive);
                    $('.player'+$scope.actualPlayer).addClass(PlayerActive);
                } else{
                    var PlayerActive2 = 'player'+$scope.actualPlayer+'Active';
                    var PlayerNotActive2 = 'player'+$scope.actualPlayer+'NotActive';
                    $('.player'+$scope.actualPlayer).removeClass(PlayerNotActive2);
                    $('.player'+$scope.actualPlayer).addClass(PlayerActive2);
                }
                break;
            case 4:
                var active = 'player'+$scope.actualPlayer+'Active';
                var notActive = 'player'+$scope.actualPlayer+'NotActive';
                $('.player'+$scope.actualPlayer).removeClass(active);
                $('.player'+$scope.actualPlayer).addClass(notActive);
                $scope.actualPlayer++;
                if($scope.actualPlayer>4){
                    $scope.actualPlayer =1;
                    var PlayerActive = 'player'+$scope.actualPlayer+'Active';
                    var PlayerNotActive = 'player'+$scope.actualPlayer+'NotActive';
                    $('.player'+$scope.actualPlayer).removeClass(PlayerNotActive);
                    $('.player'+$scope.actualPlayer).addClass(PlayerActive);
                } else{
                    var PlayerActive2 = 'player'+$scope.actualPlayer+'Active';
                    var PlayerNotActive2 = 'player'+$scope.actualPlayer+'NotActive';
                    $('.player'+$scope.actualPlayer).removeClass(PlayerNotActive2);
                    $('.player'+$scope.actualPlayer).addClass(PlayerActive2);
                }
                break;
        }
    };

    $scope.circleCircle = function () {
        $('#circleFortune').addClass('circle-circle');
        $('#circleFortune-mob').addClass('circle-circle');
    };
    $scope.deleteClasses = function () {
        $('#circleFortune').removeClass('circle-circle');
        $('#circleFortune-mob').removeClass('circle-circle');
        $('#circleFortune').removeClass($scope.className);
        $('#circleFortune-mob').removeClass($scope.className);
    };

    $scope.changeRound = function () {
        $scope.player1Avard = {money:0,material:[]};
        $scope.player2Avard = {money:0,material:[]};
        $scope.player3Avard = {money:0,material:[]};
        $scope.player4Avard = {money:0,material:[]};
        $scope.savedLetters = [];
        var checkNumber =1;
        var number = Math.floor(Math.random()*$scope.passwords.length);
        while(checkNumber!=0){
            checkNumber =0;
            for(var k=0;k<$scope.usedPasswords.length;k++){
                if(number == $scope.usedPasswords[k]){
                    checkNumber++;
                    number = Math.floor(Math.random()*$scope.passwords.length);
                }
            }
        }
        if(checkNumber===0){
            var choosedPassword = $scope.passwords[number].password;
            var splitedPassword = choosedPassword.split(" ");
            $scope.actualPassword = splitedPassword;
            $scope.fullActualPassword = $scope.passwords[number].password;
            $scope.usedPasswords.push(number);
            var html = '<div class="text-center typed-letters">';
            for(var i=0;i<splitedPassword.length;i++){
                html += '<div class="col-md-12">';
                for(var n=0;n<splitedPassword[i].length;n++){
                    html += '<span id="square'+i+n+'" class="square"></span>'
                }
                html += '</div>';
            }
            html+='</div><div class="category-password" style="text-transform: uppercase">Kategoria: '+$scope.passwords[number].category+'</div>';
            $('.password-block').html(html);
            $scope.numberRound++;
            setTimeout(function () {
                $('.winner-site').hide('slide',1000);
            },500);
            if($scope.numberRound===5){
                var price1 = $scope.playerStats.player1.money;
                var price2 = $scope.playerStats.player2.money;
                var price3 = $scope.playerStats.player3.money;
                var price4 = $scope.playerStats.player4.money;
                if(parseFloat(price1)>parseFloat(price2) && parseFloat(price1)>parseFloat(price3) && parseFloat(price1)>parseFloat(price4)){
                    $scope.playerWinners = 'Player1';
                    $scope.playerWinner =$scope.playerStats.player1;
                } else if(parseFloat(price2)>parseFloat(price1) && parseFloat(price2)>parseFloat(price3) && parseFloat(price2)>parseFloat(price4)){
                    $scope.playerWinners = 'Player2';
                    $scope.playerWinner = $scope.playerStats.player2;
                } else if(parseFloat(price3)>parseFloat(price1) && parseFloat(price3)>parseFloat(price2) && parseFloat(price3)>parseFloat(price4)){
                    $scope.playerWinners = 'Player3';
                    $scope.playerWinner = $scope.playerStats.player3;
                } else if(parseFloat(price4)>parseFloat(price1) && parseFloat(price4)>parseFloat(price3) && parseFloat(price4)>parseFloat(price2)){
                    $scope.playerWinners = 'Player4';
                    $scope.playerWinner = $scope.playerStats.player4;
                }
                var html = '<h2>Wygrana: '+$scope.playerWinner.money+' zł oraz Nagrody: '+$scope.playerWinner.material+'</h2>';
                $('.winnerStatsText').html(html);
                $('.winnerRoundsPage').show('slide',1000);

            }
        }
    };

    $scope.choosePlayer = function (number) {
        var number2 = Math.floor(Math.random()*$scope.passwords.length);
        var choosedPassword = $scope.passwords[number2].password;
        console.log(choosedPassword);
        var splitedPassword = choosedPassword.split(" ");
        $scope.actualPassword = splitedPassword;
        $scope.fullActualPassword = $scope.passwords[number2].password;
        $scope.usedPasswords.push(number2);
        var html = '<div class="text-center typed-letters">';
        for(var i=0;i<splitedPassword.length;i++){
            html += '<div class="col-md-12 col-sm-12 col-xs-12 text-center">';
            for(var n=0;n<splitedPassword[i].length;n++){
                html += '<span id="square'+i+n+'" class="square"></span>'
            }
            html += '</div>';
        }
        html+='</div><div class="category-password" style="text-transform: uppercase">Kategoria: '+$scope.passwords[number2].category+'</div>';
        $('.password-block').html(html);
        $scope.numberOfPlayers = number;
        $scope.createPlayerPanels();
        setTimeout(function () {
            $('#welcomePage').hide('slide',1000);
        },500);
    };

    $scope.startFinal = function () {
        var checkNumber = 1;
        var number = Math.floor(Math.random() * $scope.passwords.length);
        while (checkNumber != 0) {
            checkNumber = 0;
            for (var k = 0; k < $scope.usedPasswords.length; k++) {
                if (number == $scope.usedPasswords[k]) {
                    checkNumber++;
                    number = Math.floor(Math.random() * $scope.passwords.length);
                }
            }
        }
        if (checkNumber === 0) {
            var choosedPassword = $scope.passwords[number].password;
            var splitedPassword = choosedPassword.split(" ");
            $scope.actualPassword = splitedPassword;
            $scope.fullActualPassword = $scope.passwords[number].password;
            $scope.usedPasswords.push(number);
            var html = '<div class="text-center typed-letters">';
            for (var i = 0; i < splitedPassword.length; i++) {
                html += '<div class="col-md-12">';
                for (var n = 0; n < splitedPassword[i].length; n++) {
                    html += '<span id="square' + i + n + '" class="square"></span>'
                }
                html += '</div>';
            }
            html += '</div><div class="row">Hasło finałowe!</div><div class="category-password" style="text-transform: uppercase">Kategoria: ' + $scope.passwords[number].category + '</div>';
            $('.password-block').html(html);
            var finalNumberPrice = Math.floor(Math.random() * $scope.finalPrices.length);
            $scope.actualPrice = $scope.finalPrices[finalNumberPrice];
            if(!isNaN($scope.finalPrices[finalNumberPrice])){
                $('.actualPriceText').html($scope.finalPrices[finalNumberPrice]+' zł');
            } else {
                $('.actualPriceText').html($scope.finalPrices[finalNumberPrice]);
            }
            setTimeout(function () {
                $('.circle1').css('display','none');
                $('.circle2').css('display','none');
                $('.letters-div').css('display','block');
                $('.managing-panel').css('display','none');
                $('.winnerRoundsPage').hide('slide', 1000);
            }, 500);
            setTimeout(function () {
                $scope.checkStateLetters();
            },2500);
        }
    };

    $scope.checkStateLetters = function () {
        var stateLetters = ['r','s','t','l','e'];
        for(var k=0;k<stateLetters.length;k++){
            for(var i=0;i<$scope.actualPassword.length;i++){
                for(var n=0;n<$scope.actualPassword[i].length;n++){
                    if(stateLetters[k].toLowerCase() == $scope.actualPassword[i][n].toLowerCase()){
                        $('#square'+i+n).addClass('checked');
                        $('#square'+i+n).addClass('discover');
                        $('.password-block').css('border','4px solid lightgreen');
                        $('#square'+i+n).html(stateLetters[k]);
                        $scope.savedLetters.push(stateLetters[k].toLowerCase());
                    }
                }
            }
        }
    };

    $scope.checkYourLetters = function () {
        var stateLetters =[];
        var letter1 = document.getElementById('spółgłoska1').value;
        var letter2 = document.getElementById('spółgłoska2').value;
        var letter3 = document.getElementById('spółgłoska3').value;
        var letter4 = document.getElementById('samogłoska1').value;
        var letter1_mob = document.getElementById('spółgłoska1-mob').value;
        var letter2_mob = document.getElementById('spółgłoska2-mob').value;
        var letter3_mob = document.getElementById('spółgłoska3-mob').value;
        var letter4_mob = document.getElementById('samogłoska1-mob').value;
        if(letter1!=''){
            stateLetters = [letter1,letter2,letter3,letter4];
        } else{
            stateLetters = [letter1_mob,letter2_mob,letter3_mob,letter4_mob];
        }
        for(var k=0;k<stateLetters.length;k++){
            for(var i=0;i<$scope.actualPassword.length;i++){
                for(var n=0;n<$scope.actualPassword[i].length;n++){
                    if(stateLetters[k].toLowerCase() == $scope.actualPassword[i][n].toLowerCase()){
                        $('#square'+i+n).addClass('checked');
                        $('#square'+i+n).addClass('discover');
                        $('.password-block').css('border','4px solid lightgreen');
                        $('#square'+i+n).html(stateLetters[k]);
                        $scope.savedLetters.push(stateLetters[k].toLowerCase());
                    }
                }
            }
        }
        $scope.startCounter();
        $('.myletterButton').attr('disabled','true');
    };

    $scope.startCounter = function () {
        $('.counter').addClass('circle-counter-start');
        setTimeout(function () {
            $scope.counter--;
            $('.counter h1').html($scope.counter);
            $('.counter').removeClass('circle-counter-start');
            setTimeout(function () {
                if($scope.counter!=0 && !$scope.finalPasswordAnswer){
                    $scope.startCounter();
                } else if ($scope.counter===0){
                    $('.winnerRoundsInfo h1').html('Niestety nie udało Ci sie odgadnąć hasła!');
                    $('.final_game').css('display','none');
                    $('.new_game').css('display','block');
                    $('.winnerRoundsPage').show('slide',1000);
                }
                if($scope.finalPasswordAnswer){
                    $('.final_game').css('display','none');
                    $('.new_game').css('display','block');
                    $('.winnerRoundsPage').show('slide',1000);
                }
            },1001);
        },1000);
    };

    $scope.checkFinalPassword = function () {
        var password1 = '';
        var password_mob = document.getElementById('final-password-mob').value;
        var password = document.getElementById('final-password').value;
        if(password !=''){
            password1 = password;
        } else{
            password1 = password_mob;
        }
        if($scope.fullActualPassword.toLowerCase() === password1.toLowerCase()) {
            setTimeout(function () {
                for (var i = 0; i < $scope.actualPassword.length; i++) {
                    for (var n = 0; n < $scope.actualPassword[i].length; n++) {
                        $('#square' + i + n).addClass('checked');
                        $('#square' + i + n).addClass('discover');
                        $('.password-block').css('border', '4px solid lightgreen');
                        $('#square' + i + n).html($scope.actualPassword[i][n]);
                        $scope.finalPasswordAnswer = true;
                    }
                }
                if(!isNaN($scope.actualPrice)){
                    $scope.playerWinner.money = parseFloat($scope.playerWinner.money)+ parseFloat($scope.actualPrice);
                } else {
                    $scope.playerWinner.material.push($scope.actualPrice);
                }
                var html = '<h2>Wygrana: '+$scope.playerWinner.money+' zł oraz Nagrody: '+$scope.playerWinner.material+'</h2>';
                $('.winnerStatsText').html(html);
            }, 1400);
        }
    };

    $scope.guessPassword = function () {
        $('.guess-password-site').show('blind',1000);
    };

    $scope.closeGuess = function () {
        $('.guess-password-site').hide('blind',1000);
    };

    $scope.guessPasswordNow = function () {
        var password = document.getElementById('guess-input').value;
        if($scope.fullActualPassword.toLowerCase() === password.toLowerCase()){
            $('#guess-password-site').css('border','20px solid green');
            setTimeout(function () {
                $('#guess-password-site').css('border','20px solid white');
            },1000);
            $scope.closeGuess();
            setTimeout(function () {
                for(var i=0;i<$scope.actualPassword.length;i++){
                    for(var n=0; n<$scope.actualPassword[i].length;n++){
                        $('#square'+i+n).addClass('checked');
                        $('#square'+i+n).addClass('discover');
                        $('.password-block').css('border','4px solid lightgreen');
                        $('#square'+i+n).html($scope.actualPassword[i][n]);
                    }
                }
            },1400);
            setTimeout(function () {
                $('.winner-site').show('slide',1000);
                switch($scope.actualPlayer){
                    case 1:
                        $scope.playerStats.player1.money += $scope.player1Avard.money;
                        for(var n=0; n<$scope.player1Avard.material.length;n++){
                            $scope.playerStats.player1.material.push($scope.player1Avard.material[n]);
                        }
                        break;
                    case 2:
                        $scope.playerStats.player2.money += $scope.player2Avard.money;
                        for(var n=0; n<$scope.player2Avard.material.length;n++){
                            $scope.playerStats.player2.material.push($scope.player2Avard.material[n]);
                        }
                        break;
                    case 3:
                        $scope.playerStats.player3.money += $scope.player3Avard.money;
                        for(var n=0; n<$scope.player3Avard.material.length;n++){
                            $scope.playerStats.player3.material.push($scope.player3Avard.material[n]);
                        }
                        break;
                    case 4:
                        $scope.playerStats.player4.money += $scope.player4Avard.money;
                        for(var n=0; n<$scope.player4Avard.material.length;n++){
                            $scope.playerStats.player4.material.push($scope.player4Avard.material[n]);
                        }
                        break;
                }
            },3000)
        } else{
            $('#guess-password-site').css('border','20px solid red');
            $scope.closeGuess();
            setTimeout(function () {
                $('#guess-password-site').css('border','20px solid white');
            },1000);
            document.getElementById('spin').disabled = false;
            document.getElementById('check').disabled = true;
            document.getElementById('letter').disabled = true;
            document.getElementById('spin-mob').disabled = false;
            document.getElementById('check-mob').disabled = true;
            $scope.changePlayer();
        }
    };
    $scope.buyLetter = function(){
        $('.buy-site').show('slide',1000);
    };
    $scope.closeBuy = function () {
        $('.buy-site').hide('blind',1000);
    };
    $scope.closeError = function(){
        $('.error-site').hide('blind',1000);
    };
    $scope.closeStats = function () {
        $('.statsPage').hide('blind',1000);
    };
    $scope.openStats = function () {
        $('.statsPage').show('slide',1000);
    }
});