var base64Img = require('base64-img');
const JsPDF   = require('jspdf');

const LAYOUT    = base64Img.base64Sync('assets/images/layout.png');

let customer, pN, tag;

var data = new Date();
var gg, mm, aaaa;
gg = data.getDate() + "/";
mm = data.getMonth() + 1 + "/";
aaaa = data.getFullYear();
var today = gg + mm + aaaa;

$(document).ready( () => {

    $(document).on("click", "#esporta", () => {

        var pdf = new JsPDF();

        customer = $('#customer').val().trim();
        tag = $('#tag').val().trim();
        pN = $('#pN').val().trim();

        pdf.addImage(LAYOUT, 'PNG', 0, 0, 212, 297);

        pdf.setFontSize(10);
        
        pdf.text(customer.toUpperCase(), 63, 83); 
        pdf.text(tag.toUpperCase(), 63, 88.68);

        pdf.text(pN.toUpperCase(), 147.5, 83);
        pdf.text(today, 147.5, 88.68);

        pdf.setFontSize(11);
        pdf.setFontType('bold');
        pdf.text('Fluid Features', 33.4, 105);
        pdf.text('Thermowell Features', 82.4, 105);
        pdf.text('Thermowell Sketch', 137.4, 105);

        pdf.setFontSize(10);
        pdf.setFontType("normal");
        pdf.text('Pressure: ' + $('#pressure').val() + ' [bar]', 33.4, 110);
        pdf.text('Temperature: ' + $('#temperature').val() + ' [°C]', 33.4, 115);
        pdf.text('Speed: ' + $('#speed').val() + ' [m/s]', 33.4, 120);
        pdf.text('Density: ' + $('#density').val() + ' [Kg/m^3]', 33.4, 125);
        pdf.text('Viscosity: ' + $('#viscosity').val() + ' [cP]', 33.4, 130);
        
        var type = $('#selectType').val().substring(4, $('#selectType').val().length - 4),
            sketch = base64Img.base64Sync($('#selectType').val()),
            typeLower = "";
        
        switch(type){
            case 'FLANGED_THERMOWELL':
                typeLower = "Flanged"; 
                pdf.addImage(sketch, 'PNG', 143, 109, 26, 40);
                break;
            case 'WELD_IN_THERMOWELL': 
                typeLower = "Weld In";
                pdf.addImage(sketch, 'PNG', 147, 109, 15, 40);
                break;
            case 'FULL_PENETRATION_THERMOWELL': 
                typeLower = "Full Penetration";
                pdf.addImage(sketch, 'PNG', 143, 109, 26, 40);
                break;
            case 'LAP_JOINT_THERMOWELL': 
                typeLower = "Lap Join";
                pdf.addImage(sketch, 'PNG', 147, 109, 15, 40);
                break;
            case 'THREADED_THERMOWELL': 
                typeLower = "Threaded";
                pdf.addImage(sketch, 'PNG', 149, 109, 10, 40); 
                break;
        }


        pdf.setFontSize(10);
        pdf.setFontType("normal");
        pdf.text('Metal Type: ' + $('.form-check-input:checked').val(), 82.4, 110);
        pdf.text('Thermowell Type: ' + typeLower, 82.4, 115);
        pdf.text('Root Diameter: ' + $('#rootDiameter').val() + ' [mm]', 82.4, 120);
        pdf.text('Tip Diameter: ' + $('#tipDiameter').val() + ' [mm]', 82.4, 125);
        pdf.text('Internal Diameter: ' + $('#internalDiameter').val() + ' [mm]', 82.4, 130);
        pdf.text('Length: ' + $('#length').val() + ' [mm]', 82.4, 135);
        pdf.text('Minimum Thickness: ' + $('#minimumThickness').val() + ' [mm]', 82.4, 140);
        pdf.text('Nozzle Height: ' + $('#shieldLength').val() + ' [mm]', 82.4, 145);
        
        pdf.setFontSize(11);
        pdf.setFontType('bold');
        pdf.text('Wake Frequency Test:', 33.4, 170);
        ($('#wakeFrequencyCalculation').text() == "PASS") ? pdf.setTextColor(4, 135, 30) : pdf.setTextColor(165, 28, 48);
        pdf.text($('#wakeFrequencyCalculation').text(), 76.5, 170);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontType("normal");
        pdf.text('Strouhal Frequency: ' + $('#strouhalFrequency').text(), 33.4, 175);
        pdf.text('Natural Frequency: ' + $('#naturalFrequency').text(), 33.4, 180);
        pdf.text('Frequency Ratio: ' + $('#frequencyRatio').text(), 33.4, 185);

        pdf.setFontSize(11);
        pdf.setFontType("bold");
        pdf.text("Steady-State Stress Test:", 114.4, 170);
        ($('#sssc').text() == "PASS") ? pdf.setTextColor(4, 135, 30) : pdf.setTextColor(165, 28, 48);
        pdf.text($('#sssc').text(), 162.5, 170);
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontType("normal");
        pdf.text("Von Mises Stress: " + $('#vonMisesStress').text(), 114.4, 175);
        pdf.text("Stress Limit: " + $('#stressLimit1').text(), 114.4, 180);
        
        pdf.setFontSize(11);
        pdf.setFontType('bold');
        pdf.text('Pressure Test:', 33.4, 200);
        ($('#pressureTestCalculation').text() == "PASS") ? pdf.setTextColor(4, 135, 30) : pdf.setTextColor(165, 28, 48);
        pdf.text($('#pressureTestCalculation').text(), 62.5, 200);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontType("normal");
        pdf.text("Minimum External Pressure: " + $('#minExtPress').text(), 33.4, 205);
        pdf.text("Operating Pressure: " + $('#operationPressure').text(), 33.4, 210);

        pdf.setFontSize(11);
        pdf.setFontType('bold');
        pdf.text('Dynamic Stress Test:', 114.4, 200);
        ($('#dsc').text() == "PASS") ? pdf.setTextColor(4, 135, 30) : pdf.setTextColor(165, 28, 48);
        pdf.text($('#dsc').text(), 155, 200);

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.setFontType("normal");
        
        pdf.text('Combined Drag & Lift Stress: ' + $('#cdls').text(), 114.4, 205);
        pdf.text('Stress Limit: ' + $('#stressLimit2').text(), 114.4, 210);

        pdf.setFontSize(6);
        pdf.text('Itec has made every reasonable attempt to validate the calculation procedure contained in this file, however, responsability for validation rests solely with the user.', 30, 280);

        pdf.save(customer + '_' + tag + '.pdf');
        // $("#custom-modal").modal("hide");
    });


    // $('#esporta').click( () => {
    //     $("#custom-modal").modal("show");
    // });

});