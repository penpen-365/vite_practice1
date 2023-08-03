import "/assets/css/style.css";


(function(){

  // ---------- variables ----------
  let carousel_flag = true;
  /**
   * カルーセルの設定
   */
  const setup_carousel = () => {
    document.addEventListener("DOMContentLoaded", function(){
      const triggers = document.querySelectorAll(".js-sp-carousel");
      const window_width = window.innerWidth;
      const tablet_width = 768;
      const is_mobile = Boolean(window_width < tablet_width);
      const hash_name = location.hash.replace("#", "");
      const is_hash_in_carousel = hash_name ? Boolean(document.getElementById(hash_name).closest(".js-sp-carousel")) : false;

      // urlにカルーセルのhashがあったときは時差で発火
      if(is_mobile && is_hash_in_carousel){
        setTimeout(() => {
          const target = document.querySelector("a[href=\"#" + hash_name +"\"]");
          target.click();
        }, 500);
      }

      for (let i = 0; i < triggers.length; i++) {
        const trigger = triggers[i];
        const carousel = trigger.querySelector(".featureList");
        const bullets = trigger.querySelector(".bullets").children;

        [...bullets].forEach(bullet => {

          // aタグにactiveがついていたらそのターゲットを表示する
          if(is_mobile && bullet.classList.contains("active")) {
            const href = bullet.getAttribute("href");
            const target = trigger.querySelector(href);
            const x = target.getBoundingClientRect().x;

            carousel.scrollBy({
              top: 0,
              left: x,
              behavior: "instant",
            });
          }

          // カルーセルの●クリック時
          bullet.addEventListener("click", (e)=> {
            e.preventDefault();
            if(!carousel_flag) return false;
            if(!is_mobile) return false;

            const href = bullet.getAttribute("href");
            const target = trigger.querySelector(href);
            const x = target.getBoundingClientRect().x;

            carousel_flag = false;

            carousel.scrollBy({
              top: 0,
              left: x,
              behavior: "smooth",
            });

            setTimeout(() => {
              carousel_flag = true;
            }, 25);
          });
        });

        // カルーセル内スクロール時
        carousel.addEventListener("scroll", ()=>{
          if(!carousel_flag) return false;
          if(!is_mobile) return false;
          carousel_flag = false;
          const index = Math.round(carousel.scrollLeft/window_width);

          [...bullets].forEach(bullet => bullet.classList.remove("active"));
          bullets[index].classList.add("active");

          setTimeout(() => {
            carousel_flag = true;
          }, 25);
        });
      }
    });
  };


  /*
  * main process
  ======================================== */

  setup_carousel();
})();
