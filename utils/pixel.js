async function fbPixelRequest(event, productid) {
    var urlServico = 'https://digitalstoregames.pythonanywhere.com/fbPixel?event=' + encodeURIComponent(event) + '&productid=' + encodeURIComponent(productid);
    var fbp = getCookie('_fbp');
    var fbc = getCookie('_fbc');

    if (fbp) {
        urlServico += '&fbp=' + encodeURIComponent(fbp);
    }
    if (fbc) {
        urlServico += '&fbc=' + fbc;
    }

    const response = await fetch(urlServico);
    const data = await response.text();
    return data;
}