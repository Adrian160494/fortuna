/**
 * Created by Adrian on 01.04.2018.
 */

var app = angular.module('app',[]);


app.controller('mainController',function ($scope, $http, $timeout) {
    $scope.passwords = [{category: 'powiedzenie',password: 'Wiercić komuś dziure w brzuchu'},{category:'powiedzenie',password:'Gdzie kucharek sześć tam nie ma co jeść'}];
    $scope.prices = ['2000','350','250','1500','NAGRODA','200','150','250','500','BANKRUT','400','1000','250','STOP','400','200','WYCIECZKA','5000','150','250','300','150','200','BANKRUT'];
    $scope.className = null;
    $scope.actualPrice = 'Zacznij!';
    $scope.numberOfPlayers = 1;
    $scope.actualPassword = null;
    $scope.fullActualPassword = null;
    $scope.actualPlayer = 1;
    $scope.letterChallenger = 0;
    $scope.player1Avard = {money:0,material:[]};
    $scope.player2Avard = {money:0,material:[]};
    $scope.player3Avard = {money:0,material:[]};
    $scope.player4Avard = {money:0,material:[]};
    $scope.savedLetters = [];
    $scope.numberRound = 1;
    $scope.prohibitedLetters = ['e','y','i','a'];
    $scope.usedPasswords = [];
    $scope.playerStats = [
        {player1:{money:0,material:0}},
        {player2:{money:0,material:0}},
        {player3:{money:0,material:0}},
        {player4:{money:0,material:0}}
        ];

    $scope.initFunction = function(){
        $('.player1').addClass('player1Active');
        $('.player2').addClass('player2NotActive');
        $('.player3').addClass('player3NotActive');
        $('.player4').addClass('player4NotActive');
    };
    window.onload = $scope.initFunction();

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

    $scope.circle = function () {
        if($scope.className!=null){
            $scope.deleteClasses();
        }
        document.getElementById('spin').disabled = true;
        document.getElementById('check').disabled = false;
        document.getElementById('letter').disabled = false;
        setTimeout(function () {
            var price  = Math.floor(Math.random()*24);
            var className = 'rotate'+price;
            $scope.className = className;
            $scope.circleCircle();
            setTimeout(function () {
                $('#circleFortune').addClass(className);
                $scope.actualPrice = $scope.prices[23-price];
                if($scope.prices[23-price].toLowerCase() == 'bankrut'){
                    document.getElementById('spin').disabled = false;
                    document.getElementById('check').disabled = true;
                    document.getElementById('letter').disabled = true;
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
                    console.log('Wchodze to stop');
                    $scope.changePlayer();
                    document.getElementById('spin').disabled = false;
                    document.getElementById('check').disabled = true;
                    document.getElementById('letter').disabled = true;
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
        for(var i=0;i<$scope.actualPassword.length;i++){
            for(var n=0;n<$scope.actualPassword[i].length;n++){
                console.log($scope.actualPassword[i][n]);
                if(letter.toLowerCase() == $scope.actualPassword[i][n].toLowerCase()){
                    $('#square'+i+n).addClass('checked');
                    $('#square'+i+n).addClass('discover');
                    $('.password-block').css('border','4px solid lightgreen');
                    $('#square'+i+n).html(letter);
                    $scope.letterChallenger++;
                    $scope.savedLetters.push(letter.toLowerCase());
                    if(!isNaN(parseFloat($scope.actualPrice))){
                        switch($scope.actualPlayer){
                            case 1:
                                $scope.player1Avard.money = parseFloat($scope.player1Avard.money) + (parseFloat($scope.letterChallenger)* parseFloat($scope.actualPrice));
                                break;
                            case 2:
                                $scope.player2Avard.money = parseFloat($scope.player2Avard.money) + (parseFloat($scope.letterChallenger)* parseFloat($scope.actualPrice));
                                break;
                            case 3:
                                $scope.player3Avard.money = parseFloat($scope.player3Avard.money) + (parseFloat($scope.letterChallenger)* parseFloat($scope.actualPrice));
                                break;
                            case 4:
                                $scope.player4Avard.money = parseFloat($scope.player4Avard.money) + (parseFloat($scope.letterChallenger)* parseFloat($scope.actualPrice));
                                break;
                        }
                    } else if($scope.actualPrice.toLowerCase() === 'nagroda' || $scope.actualPrice.toLowerCase() === 'wycieczka'){
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
    };
    $scope.deleteClasses = function () {
        $('#circleFortune').removeClass('circle-circle');
        $('#circleFortune').removeClass($scope.className);
    };

    $scope.changeRound = function () {
        var checkNumber =1;
        var number = Math.floor(Math.random()*2);
        while(checkNumber!=0){
            checkNumber =0;
            for(var k=0;k<$scope.usedPasswords.length;k++){
                if(number == $scope.usedPasswords[k]){
                    checkNumber++;
                    number = Math.floor(Math.random()*2);
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
        }
    };

    $scope.choosePlayer = function (number) {
        var number2 = Math.floor(Math.random()*2);
        var choosedPassword = $scope.passwords[number2].password;
        console.log(choosedPassword);
        var splitedPassword = choosedPassword.split(" ");
        $scope.actualPassword = splitedPassword;
        $scope.fullActualPassword = $scope.passwords[number2].password;
        $scope.usedPasswords.push(number2);
        var html = '<div class="text-center typed-letters">';
        for(var i=0;i<splitedPassword.length;i++){
            html += '<div class="col-md-12">';
            for(var n=0;n<splitedPassword[i].length;n++){
                html += '<span id="square'+i+n+'" class="square"></span>'
            }
            html += '</div>';
        }
        html+='</div><div class="category-password" style="text-transform: uppercase">Kategoria: '+$scope.passwords[number2].category+'</div>';
        $('.password-block').html(html);
        $scope.numberOfPlayers = number;
        $scope.createPlayerPanels();
        console.log($scope.actualPassword);
        setTimeout(function () {
            $('#welcomePage').hide('slide',1000);
        },500);
    };
    $scope.guessPassword = function () {
        $('.guess-password-site').show('blind',1000);
    };

    $scope.closeGuess = function () {
        $('.guess-password-site').hide('blind',1000);
    };

    $scope.guessPasswordNow = function () {
        console.log('Dzialam guess password now');
        var password = document.getElementById('guess-input').value;
        console.log($scope.fullActualPassword.toLowerCase());
        console.log(password.toLowerCase());
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
});