
// Order Form
let my_price_orderToSent = {
    serviceType: '',
    format: '',
    copies: 0,
    printType: '',
    colorType: '',
    finalprice: 0
};

function updateOrderForm() {
    const serviceType = document.getElementById('serviceType').value;
    document.getElementById('submit-estimated-calc-btn').classList.add('hidden');
    document.getElementById('printingOptions').classList.add('hidden');
    document.getElementById('priceResult').style.display = 'none';

    if (serviceType === 'printing') {
        document.getElementById('printingOptions').classList.remove('hidden');

    }
}

function calculatePrice() {
    const serviceType = document.getElementById('serviceType').value;
    let price = 0;
    let finalprice = 0;

    if (serviceType === 'printing') {
        document.getElementById('submit-estimated-calc-btn').classList.remove('hidden');
        document.getElementById('submit-estimated-calc-btn').classList.add('calculate-btn');
        const format = document.getElementById('printFormat').value;
        const copies = parseInt(document.getElementById('copies').value) || 1;
        const printType = document.getElementById('printType').value;
        const colorType = document.getElementById('colorType').value;

        const formatPrices = {
            'A5': 0.5,
            'A4': 0.8,
            'A3': 2,
            'SRA3': 2.5,
            'A2': 4,
            'A1': 8,
            'A0': 15
        };

        price = formatPrices[format] * copies;
        finalprice = price;

        if (printType === 'double') {
            finalprice = price * 1.8;
        }
        if (colorType === 'color') {
            finalprice = price * 1.5;
        }
        if (colorType === 'color' && printType === 'double') {
            finalprice = price * 1.5 * 1.8;
        }

        my_price_orderToSent = {
            serviceType: serviceType,
            format: format,
            copies: copies,
            printType: printType,
            colorType: colorType,
            finalprice: finalprice
        };

    }

    document.getElementById('priceResult').innerHTML = `Estimated Price: ${finalprice.toFixed(2)} RON`;
    document.getElementById('priceResult').style.display = 'block';
}

function sendEstimatedData() {

    const message = `
Dear Sovis Print Team,

I would like to place an order with the following details:

Service Type: ${my_price_orderToSent.serviceType}
Format: ${my_price_orderToSent.format}
Copies: ${my_price_orderToSent.copies}
Print Type: ${my_price_orderToSent.printType}
Color Type: ${my_price_orderToSent.colorType}
Final Price: ${my_price_orderToSent.finalprice.toFixed(2)} RON
    `.trim();


    const contactMessageField = document.getElementById('contactMessage');
    if (contactMessageField) {
        contactMessageField.value = message;
    }


    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

}
