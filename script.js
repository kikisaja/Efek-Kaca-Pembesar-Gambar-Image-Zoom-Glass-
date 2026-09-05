// Jalankan script setelah seluruh elemen DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
    // Panggil fungsi imageZoom dengan ID gambar dan tingkat perbesaran (zoom level = 2.5)
    imageZoom("myImage", 2.5);
});

function imageZoom(imgID, zoom) {
    var img, glass, bw, w, h;
    img = document.getElementById(imgID);

    // 1. Buat elemen kaca pembesar secara dinamis
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-zoom-glass");

    // Sisipkan kaca pembesar ke dalam container gambar
    img.parentElement.insertBefore(glass, img);

    // 2. Atur latar belakang kaca pembesar dengan gambar yang sama
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";

    // Hitung ketebalan border kaca pembesar agar perhitungan koordinat tepat
    bw = 3;

    // Tunggu hingga gambar selesai dimuat penuh untuk mendapatkan dimensi yang akurat
    img.addEventListener("load", setupZoom);
    if (img.complete) {
        setupZoom();
    }

    function setupZoom() {
        // Hitung ukuran latar belakang kaca pembesar berdasarkan rasio zoom
        glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";

        w = glass.offsetWidth / 2;
        h = glass.offsetHeight / 2;

        // 3. Tambahkan event listener untuk pergerakan mouse dan touch (pada layar sentuh)
        glass.addEventListener("mousemove", moveMagnifier);
        img.addEventListener("mousemove", moveMagnifier);

        glass.addEventListener("touchmove", moveMagnifier);
        img.addEventListener("touchmove", moveMagnifier);
    }

    function moveMagnifier(e) {
        var pos, x, y;

        // Mencegah efek default (misal: scroll pada layar sentuh)
        e.preventDefault();

        // Dapatkan posisi kursor (x dan y) relatif terhadap gambar
        pos = getCursorPos(e);
        x = pos.x;
        y = pos.y;

        // Batasi kursor agar tidak keluar dari area gambar
        if (x > img.width - (w / zoom)) { x = img.width - (w / zoom); }
        if (x < w / zoom) { x = w / zoom; }
        if (y > img.height - (h / zoom)) { y = img.height - (h / zoom); }
        if (y < h / zoom) { y = h / zoom; }

        // Atur posisi fisik elemen kaca pembesar (center kursor)
        glass.style.left = (x - w) + "px";
        glass.style.top = (y - h) + "px";

        // Atur posisi background image di dalam kaca pembesar
        glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }

    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;

        // Dapatkan posisi bounding box gambar pada layar
        a = img.getBoundingClientRect();

        // Hitung koordinat x dan y kursor relatif terhadap ujung kiri-atas gambar
        x = e.pageX - a.left;
        y = e.pageY - a.top;

        // Pertimbangkan efek scroll halaman
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;

        return { x: x, y: y };
    }
}
