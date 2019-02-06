function isEmpty(input){
    if (input.value.trim() == "")
        return true;

    return false;
}

function checkObject(input){
    if(!isEmpty(input)){
        borderSuccess(input);
        return true;
    }
    else{
        borderDanger(input);
        return false;
    }
}

function borderSuccess(input){ 
    if($(input).hasClass('form-control-danger') && $(input).parent().hasClass('has-danger')){
        $(input).removeClass('form-control-danger');
        $(input).parent().removeClass('has-danger');
    }

    $(input).addClass('form-control-success');
    $(input).parent().addClass('has-success');
}

function borderDanger(input){
    if($(input).hasClass('form-control-success') && $(input).parent().hasClass('has-success')){
        $(input).removeClass('form-control-success');
        $(input).parent().removeClass('has-success');
    }

    $(input).addClass('form-control-danger');
    $(input).parent().addClass('has-danger');
}

function testAllField(){
    var pressione = checkObject(document.getElementById('pressure'));
    var temperature = checkObject(document.getElementById('temperature'));
    var speed = checkObject(document.getElementById('speed'));
    var density = checkObject(document.getElementById('density'));
    var viscosity = checkObject(document.getElementById('viscosity'));
    var rootDiameter = checkObject(document.getElementById('rootDiameter'));
    var tipDiameter = checkObject(document.getElementById('tipDiameter'));
    var internalDiameter = checkObject(document.getElementById('internalDiameter'));
    var length = checkObject(document.getElementById('length'));
    var minimumThickness = checkObject(document.getElementById('minimumThickness'));
    var shieldLength = checkObject(document.getElementById('shieldLength'));

    return (pressione && temperature && speed && density && viscosity && rootDiameter && tipDiameter && internalDiameter && length && minimumThickness && shieldLength);
}

function setSf(type) {
    var sF;

    if (type == "FLANGED_THERMOWELL" || type == "WELD_IN_THERMOWELL") return sF = 372;
    else if (type == "FULL_PENETRATION_THERMOWELL") return sF = 628;
    else if (type == "LAP_JOINT_THERMOWELL" || type == "THREADED_THERMOWELL") return sF = 938;
}

function setVariableNr(speed, tipDiameter, density, viscosity) {
    return speed * tipDiameter * density / viscosity;
}

function setVariableNsc(DELTA, METAL_DENSITY_M, density, internalDiameter, tipDiameter) { 
    return Math.pow(Math.PI, 2) * DELTA * (METAL_DENSITY_M / density) * (1 - Math.pow(internalDiameter / tipDiameter, 2));
}

function setGsp(shieldLength, length, rootDiameter, internalDiameter, tipDiameter) {

    var gSp;

    if (shieldLength == 0) gSp = 16 * Math.pow(length, 2) / (3 * Math.PI * Math.pow(rootDiameter, 2) * (1 - Math.pow(internalDiameter / rootDiameter, 4))) * (1 + 2 * (tipDiameter / rootDiameter));
    else gSp = 16 * Math.pow(length, 2) / (3 * Math.PI * Math.pow(rootDiameter, 2) * (1 - Math.pow((internalDiameter / rootDiameter), 4))) * (3 * (1 - Math.pow(shieldLength / length, 2)) + 2 * (tipDiameter / rootDiameter - 1) * (1 - Math.pow(shieldLength / length, 3)));

    return gSp;
}

function setS(typeMetal, temperature) {
    var S;

    if(typeMetal == "316") {
        if (temperature < 40)  S = 18.8;
            else if (temperature >= 40 && temperature < 100) S = 16.2;
            else if (temperature >= 100 && temperature < 150) S = 14.6;
            else if (temperature >= 150 && temperature < 200) S = 13.4;
            else if (temperature >= 200 && temperature < 260) S = 12.5;
            else if (temperature >= 260 && temperature < 315) S = 11.8;
            else if (temperature >= 315 && temperature < 345) S = 11.6;
            else if (temperature >= 345 && temperature < 370) S = 11.3;
            else if (temperature >= 370 && temperature < 400) S = 11.2;
            else if (temperature >= 400 && temperature < 425) S = 11.0;
            else if (temperature >= 425 && temperature < 450) S = 10.9;
            else if (temperature >= 450) S = 10.8;
    }
    else if(typeMetal == "316L") {
        if (temperature < 40) S = 16.7;
            else if (temperature >= 40 && temperature < 100) S = 14.1;
            else if (temperature >= 100 && temperature < 150) S = 12.7;
            else if (temperature >= 150 && temperature < 200) S = 11.7;
            else if (temperature >= 200 && temperature < 260) S = 10.9;
            else if (temperature >= 260 && temperature < 315) S = 10.4;
            else if (temperature >= 315 && temperature < 345) S = 10.2;
            else if (temperature >= 345 && temperature < 370) S = 10.0;
            else if (temperature >= 370 && temperature < 400) S = 9.8;
            else if (temperature >= 400 && temperature < 425) S = 9.6;
            else if (temperature >= 425 && temperature < 450) S = 9.4;
            else if (temperature >= 450) S = 9.3;
    }

    return S;
}

function setYoungModule(temperature){
    var E;

    if (temperature < 40) E = 195000000;
    else if (temperature >= 40 && temperature < 100) E = 189000000;
    else if (temperature >= 100 && temperature < 150) E = 186000000;
    else if (temperature >= 150 && temperature < 200) E = 183000000;
    else if (temperature >= 200 && temperature < 260) E = 179000000;
    else if (temperature >= 260 && temperature < 315) E = 176000000;
    else if (temperature >= 315 && temperature < 345) E = 172000000;
    else if (temperature >= 345 && temperature < 400) E = 169000000;
    else if (temperature >= 400) E = 165000000;

    return E;
}

function setVariableMax(E, sF, E_REF) {
    return E * sF / E_REF;
}

function naturalFrequencyCalculation(
    rootDiameter, 
    tipDiameter, 
    internalDiameter, 
    METAL_DENSITY_MM, 
    length, 
    density, 
    METAL_DENSITY_M, 
    RHO_S, 
    type, 
    E){

   /* STEP 1 */
   var I = Math.PI * (Math.pow((+rootDiameter + +tipDiameter)/2, 4) - Math.pow(internalDiameter, 4)) / 64;
   

   var m = METAL_DENSITY_MM * (Math.PI) / 4 * (Math.pow(((+rootDiameter + +tipDiameter)/2), 2) - Math.pow(internalDiameter, 2));
   
   var fa = Math.pow(1.875, 2) / (2 * Math.PI) * Math.sqrt(E * I / m) / Math.pow(length, 2);
   
   /* STEP 2 */
   var exp = 3 * (1 - (0.8 * (2 * internalDiameter / (+rootDiameter + +tipDiameter))));
   
   var Hf  = 0.99 * (1 + (1 - (tipDiameter / rootDiameter)) + Math.pow(1 - (tipDiameter / rootDiameter), 2))/(1 + 1.1 * Math.pow((+rootDiameter + +tipDiameter) / (2 * length), exp));
   
   /* STEP 3*/
   var Haf = 1 - (density / (2 * METAL_DENSITY_M));
   
   /* STEP 4 */
   var Has = 1 - (RHO_S / (2 * METAL_DENSITY_M)) * (1 / (Math.pow((+rootDiameter + +tipDiameter) / (2 * internalDiameter), 2) - 1));
   
   /* STEP 5 */
   var fn = Hf * Haf * Has * fa;
   
   /* STEP 6 */
   var Hc;
    if(type == "THREADED_THERMOWELL")
        Hc = 1 - (0.9) * (rootDiameter / length);
    else 
        Hc = 1 - (0.61) * (rootDiameter / length);
    

   /* STEP 7 */
   var fnc = Hc * fn;       
   
   return fnc;
}

function strouhalFrequencyCalculation(N_S, speed, tipDiameter) {
    return N_S * 1000 * speed / tipDiameter;
}

function frequencyRatioLimit(nSc, 
    nR, 
    C_D_SMALL, 
    rootDiameter, 
    tipDiameter, 
    internalDiameter, 
    METAL_DENSITY_MM, 
    length, 
    density, 
    METAL_DENSITY_M, 
    RHO_S, 
    type, 
    N_S, 
    speed, 
    E,
    max, kT, gSp) {

    var rL; 

    if (nSc > 2.5 && nR < 100000) rL = 0.8;
    else {
        var Vir, pd, r, Fm1, sd, Smax;
        
        Vir = naturalFrequencyCalculation(rootDiameter, tipDiameter, internalDiameter, METAL_DENSITY_MM, length, density, METAL_DENSITY_M, RHO_S, type, E) * tipDiameter * 0.0005 / N_S; 
        pd = 0.5 * density * C_D_SMALL * Math.pow(Vir, 2);
        r = strouhalFrequencyCalculation(N_S, speed, tipDiameter) / naturalFrequencyCalculation(rootDiameter, tipDiameter, internalDiameter, METAL_DENSITY_MM, length, density, METAL_DENSITY_M, RHO_S, type, E);
        Fm1 = 1 / (1 - Math.pow(2 * r, 2));
        sd = gSp * Fm1 * pd;
        Smax = kT * sd * 0.00001;
        
        if (Smax < max) rL = 0.8;
        else rL = 0.4;
    }
    
    return rL;
}

function pressureStressPC(tipDiameter, internalDiameter, S) { 
    return 0.66 * 68.75 * S * (2.167 * (+tipDiameter - +internalDiameter) / (2 * tipDiameter) - 0.0833);
}


function pressureStressPT(minimumThickness, internalDiameter, S) {
    return 68.75 * S / 0.13 * Math.pow((minimumThickness / internalDiameter), 2);
}

function setLHS(pressure, internalDiameter, rootDiameter, density, C_D_BIG, speed, gSp) {
    var Sr, St, Sa, PD, SD, Smax;

    Sr = pressure;
    St = pressure * (1 + Math.pow((internalDiameter / rootDiameter), 2)) / (1 - Math.pow((internalDiameter / rootDiameter), 2));
    Sa = pressure / (1 - Math.pow((internalDiameter / rootDiameter), 2));
    PD = 0.5 * density * C_D_BIG * Math.pow(speed, 2);
    SD = gSp * PD * 0.00001; 
    Smax = SD + Sa;
    
    return Math.sqrt(0.5 * (Math.pow(Smax - Sr, 2) + Math.pow(Smax - St, 2) + Math.pow(St - Sr, 2)));
}

function setRHS(S) {
    return 1.5 * S * 68.75;
}

function setS0max(C_D_SMALL, C_L, kT, rootDiameter, tipDiameter, internalDiameter, METAL_DENSITY_MM, length, density, METAL_DENSITY_M, RHO_S, type, N_S, speed, E, gSp) {
    var r, FM, FM1, Pd, Pl, Sd, Sl;

    r = strouhalFrequencyCalculation(N_S, speed, tipDiameter) / naturalFrequencyCalculation(rootDiameter, tipDiameter, internalDiameter, METAL_DENSITY_MM, length, density, METAL_DENSITY_M, RHO_S, type, E);
    FM = 1 / (1 - Math.pow(r, 2));
    FM1 = 1 / (1 - Math.pow(2 * r, 2));
    Pd = 0.5 * density * C_D_SMALL * Math.pow(speed, 2);
    Pl = 0.5 * density * C_L * Math.pow(speed, 2);
    Sd = gSp * FM1 * Pd;
    Sl = gSp * FM * Pl;
    
    return kT * 0.00001 * Math.sqrt(Math.pow(Sd, 2) + Math.pow(Sl, 2));
}