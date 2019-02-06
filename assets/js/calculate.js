$(document).ready( () => {

    $('#calcola').click(function(){
        if(!$('#316').is(':checked') && !$('#316L').is(':checked')) alert("ERRORE: Seleziona il tipo di metallo");
        if($('#selectType').val() == "-- Seleziona il tipo --") alert("ERRORE: Seleziona il tipo di thermowell");

        if(testAllField() && $('#selectType').val() != "-- Seleziona il tipo --" && ($('#316').is(':checked') || $('#316L').is(':checked'))){
            const E_REF = 195000000, METAL_DENSITY_M = 7980, METAL_DENSITY_MM = 0.00000798, RHO_S = 2707.12;
            const N_S = 0.22, DELTA = 0.0005, C_D_BIG = 1.4, C_D_SMALL = 0.1, C_L = 1.0, kT = 2.2;

            var pressione = $('#pressure').val();
            var temperature = $('#temperature').val();
            var speed = $('#speed').val();
            var density = $('#density').val();
            var viscosity = $('#viscosity').val();
            var rootDiameter = $('#rootDiameter').val();
            var tipDiameter = $('#tipDiameter').val();
            var internalDiameter = $('#internalDiameter').val();
            var length = $('#length').val();
            var minimumThickness = $('#minimumThickness').val();
            var shieldLength = $('#shieldLength').val();
            
            var string = $('#selectType').val();
            var type = string.substring(string.indexOf('/') + 1, string.indexOf('.'));
            
            var typeMetal = $('.form-check-input:checked').val();
            
            var sF = setSf(type);
            var nR = setVariableNr(speed, tipDiameter, density, viscosity);
            var nSc = setVariableNsc(DELTA, METAL_DENSITY_M, density, internalDiameter, tipDiameter);
            var gSp = setGsp(shieldLength, length, rootDiameter, internalDiameter, tipDiameter);
            var S = setS(typeMetal, temperature);
            var E = setYoungModule(temperature);
            var max = setVariableMax(E, sF, E_REF);
            var fnc = naturalFrequencyCalculation(rootDiameter, tipDiameter, internalDiameter, METAL_DENSITY_MM, length, density, METAL_DENSITY_M, RHO_S, type, E);
            var sFc = strouhalFrequencyCalculation(N_S, speed, tipDiameter);
            var rL = frequencyRatioLimit(nSc, nR, C_D_SMALL, rootDiameter, tipDiameter, internalDiameter, METAL_DENSITY_MM, length, density, METAL_DENSITY_M, RHO_S, type, N_S, speed, E, max, kT, gSp);
            var stressPC = pressureStressPC(tipDiameter, internalDiameter, S);
            var stressPT = pressureStressPT(minimumThickness, internalDiameter, S);
            var lHs = setLHS(pressione, internalDiameter, rootDiameter, density, C_D_BIG, speed, gSp);
            var rHs = setRHS(S);
            var S0max = setS0max(C_D_SMALL, C_L, kT, rootDiameter, tipDiameter, internalDiameter, METAL_DENSITY_MM, length, density, METAL_DENSITY_M, RHO_S, type, N_S, speed, E, gSp);

            $('#strouhalFrequency').text(' ' + Math.round(sFc * 10) / 10 + ' Hz').css('color', '#2222d6');
            $('#naturalFrequency').text(' ' + Math.round(fnc * 10) / 10 + ' Hz').css('color', '#2222d6');
            
            if ((Math.round(sFc / fnc * 100) / 100) < rL)         $('#frequencyRatio').text(' ' + Math.round(sFc / fnc * 100) / 100 + ' < ' + rL).css('color', '#2222d6');
            else if ((Math.round(sFc / fnc * 100) / 100) > rL)    $('#frequencyRatio').text(' ' + Math.round(sFc / fnc * 100) / 100 + ' > ' + rL).css('color', '#2222d6');
            else if ((Math.round(sFc / fnc * 100) / 100) == rL)   $('#frequencyRatio').text(' ' + rL).css('color', '#2222d6');
            
            $('#minExtPress').text(' ' + Math.round(Math.min(stressPC, stressPT) * 10) / 10 + ' bar').css('color', '#2222d6');
            $('#operationPressure').text(' ' + Math.round(pressione) + ' bar').css('color', '#2222d6');
            $('#vonMisesStress').text(' ' + Math.round(lHs * 10) / 10 + ' bar').css('color', '#2222d6');
            $('#stressLimit1').text(' ' + Math.round(rHs * 10) / 10 + ' bar').css('color', '#2222d6');
            $('#cdls').text(' ' + Math.round(S0max * 10) / 10 + ' bar').css('color', '#2222d6');
            $('#stressLimit2').text(' ' + Math.round(max * 10) / 10 + ' bar').css('color', '#2222d6');
            

            if(sFc / fnc < rL) $('#wakeFrequencyCalculation').text('PASS').css('color', '#04871e');
            else  $('#wakeFrequencyCalculation').text('FAIL').css('color', '#a51c30');
            
            if(Math.min(stressPC, stressPT) > pressione)  $('#pressureTestCalculation').text("PASS").css('color', '#04871e');
            else  $('#pressureTestCalculation').text("FAIL").css('color', '#a51c30');
            
            if(lHs < rHs) $('#sssc').text("PASS").css('color', '#04871e');
            else $('#sssc').text("FAIL").css('color', '#a51c30');
            
            if(S0max < max) $('#dsc').text("PASS").css('color', '#04871e');
            else $('#dsc').text("FAIL").css('color', '#a51c30');
        }
    });

});