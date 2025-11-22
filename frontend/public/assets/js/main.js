function counterUp(t) {
  "use strict";
  this.defaults = {
    duration: 3e3,
    prepend: "",
    append: "%",
    selector: ".countup",
    start: 0,
    end: 100,
    intvalues: !1,
    interval: 100,
  };
  var e = this;
  (this.upating = !1), (this.intervalID = null), (this.props = {});
  for (var r in this.defaults)
    "undefined" != typeof r &&
      ((e.props[r] = e.defaults[r]),
      t.hasOwnProperty(r) && e.props.hasOwnProperty(r) && (e.props[r] = t[r]));
  (this.domelems = document.querySelectorAll(this.props.selector)),
    (this.elems = []);
  var n = {};
  this.domelems.forEach(function (t) {
    n.obj = t;
    var r = parseInt(t.getAttribute("cup-start"));
    isNaN(r) ? (n.start = e.props.start) : (n.start = r);
    var p = parseInt(t.getAttribute("cup-end"));
    isNaN(p) ? (n.end = e.props.end) : (n.end = p);
    var a = parseInt(t.getAttribute("cup-duration"));
    isNaN(a) ? (n.duration = e.props.duration) : (n.duration = a);
    var s = t.getAttribute("cup-prepend");
    null == s ? (n.prepend = e.props.prepend) : (n.prepend = s);
    var i = t.getAttribute("cup-append");
    null == i ? (n.append = e.props.append) : (n.append = i);
    var o = t.getAttribute("cup-intval");
    null == o ? (n.intvalues = e.props.intvalues) : (n.intvalues = o),
      (n.step = (n.end - n.start) / (n.duration / e.props.interval)),
      (n.val = n.start),
      e.elems.push(n),
      (n = {});
  });
}
(counterUp.prototype.start = function () {
  "use strict";
  var t = this;
  this.intervalID = setInterval(function () {
    t.updating || t.update();
  }, t.props.interval);
}),
  (counterUp.prototype.update = function () {
    "use strict";
    this.updating = !0;
    var t = !0;
    this.elems.forEach(function (e) {
      (e.val += e.step),
        e.val < e.end
          ? (1 == e.intvalues
              ? (e.obj.innerHTML =
                  e.prepend + Math.floor(e.val).toString() + e.append)
              : (e.obj.innerHTML =
                  e.prepend +
                  (Math.round(100 * e.val) / 100).toString() +
                  e.append),
            (t = !1))
          : (e.obj.innerHTML = e.prepend + e.end.toString() + e.append);
    }),
      1 == t && clearInterval(this.intervalID),
      (this.updating = !1);
  });

(function () {
  "use strict";

  //===== Preloader

  window.onload = function () {
    window.setTimeout(fadeout, 500);
  };

  function fadeout() {
    document.querySelector(".preloader").style.opacity = "0";
    document.querySelector(".preloader").style.display = "none";
  }

  // ==== Sticky Menu
  window.onscroll = function () {
    const header_navbar = document.getElementById("header_navbar");
    const sticky = header_navbar.offsetTop;

    if (window.pageYOffset > sticky) {
      header_navbar.classList.add("sticky");
    } else {
      header_navbar.classList.remove("sticky");
    }

    // show or hide the back-top-top button
    const backToTo = document.querySelector(".back-to-top");
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      backToTo.style.display = "block";
    } else {
      backToTo.style.display = "none";
    }
  };

  // for menu scroll
  const pageLink = document.querySelectorAll(".page-scroll");

  pageLink.forEach((elem) => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(elem.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
        offsetTop: 1 - 60,
      });
    });
  });

  // section menu active
  function onScroll(event) {
    const sections = document.querySelectorAll(".page-scroll");
    const scrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

    for (let i = 0; i < sections.length; i++) {
      const currLink = sections[i];
      const val = currLink.getAttribute("href");
      const refElement = document.querySelector(val);
      const scrollTopMinus = scrollPos + 73;
      if (
        refElement.offsetTop <= scrollTopMinus &&
        refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
      ) {
        document.querySelector(".page-scroll").classList.remove("active");
        currLink.classList.add("active");
      } else {
        currLink.classList.remove("active");
      }
    }
  }

  window.document.addEventListener("scroll", onScroll);

  //===== close navbar-collapse when a  clicked
  let navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  document.querySelectorAll(".page-scroll").forEach((e) =>
    e.addEventListener("click", () => {
      navbarToggler.classList.remove("active");
      navbarCollapse.classList.remove("show");
    })
  );
  navbarToggler.addEventListener("click", function () {
    navbarToggler.classList.toggle("active");
  });

  //====== counter up
  const cu = new counterUp({
    start: 0,
    duration: 2000,
    intvalues: true,
    interval: 100,
    append: "k",
  });
  cu.start();

  //========= glightbox
  GLightbox({
    selector: ".glightbox",
    href: "assets/video/Free App Landing Page Template - AppLand.mp4",
    type: "video",
    source: "youtube", //vimeo, youtube or local
    width: 900,
    autoplayVideos: true,
  });

  //WOW Scroll Spy
  const wow = new WOW({
    //disabled for mobile
    mobile: false,
  });
  wow.init();
})();
