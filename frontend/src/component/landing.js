import React from "react";
import { Link } from "react-router-dom";
import mbaadmin from "../../src/img/ftr-section/457616178_886416680051394_405887903358592244_n-removebg-preview.png";
import headerimg from "../../src/img/ftr-section/header-img.jpg";
import ftrsection from "../../src/img/ftr-section/ftr-section.jpg";
import { Helmet } from "react-helmet";

const Landing = () => {
  return (
    <div className="landing">
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-solid-rounded/css/uicons-solid-rounded.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css"
        ></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
      <div className="header-section">
        <div className="mba-logo">
          <img src={mbaadmin} alt="AdminMBA"></img>
        </div>
        <div className="header-row">
          <div className="col-fst">
            <h1 className="mba_heading">
              Why Become <br /> <span>An MBA Parent?</span>
            </h1>
            <p className="master_para">
              Do you Love what Mastery is doing for your Child? <br />
              <br /> Do you love what Mastery stands for?
            </p>
            <p className="master_para">
              Want to help other Parents learn about How <br />
              <br /> Mastery can help their children?
            </p>
            <Link to="/signin" className="cta-button">
              Apply Now
            </Link>
          </div>
          <div className="col-fst">
            <img src={headerimg} alt="headerimg"></img>
          </div>
        </div>
      </div>

      <div className="rewards-section">
        <h1>Rewards</h1>
        <div className="reward-row">
          <div className="reward-col">
            <i class="fi fi-rr-social-network"></i>
            <h4>Earn Mastery Swag</h4>
          </div>
          <div className="reward-col">
            <i class="fi fi-rr-chart-user"></i>
            <h4>Monthly MBA Only Training Seminars For Your Children</h4>
          </div>
          <div className="reward-col">
            <i class="fi fi-rr-gift"></i>
            <h4>Monthly, Quarterly Giveaways</h4>
          </div>
          <div className="reward-col">
            <i class="fi fi-rr-badge"></i>
            <h4>Yearly Giant Giveaways</h4>
          </div>
        </div>
      </div>

      {/* expecttation section */}
      <div className="expectataion-section">
        <h1>Our Expectation</h1>
        <div className="exp-row">
          <div className="col-cmn">
            <i class="fi fi-brands-slack"></i>
            <p>
              MAKE 2-3 SOCIAL MEDIA POSTS PER MONTH (FB OR IG) - DON’T WORRY WE
              WILL HELP YOU WITH THE FORMULA.
            </p>
          </div>
          <div className="col-cmn">
            <i class="fi fi-sr-chart-network"></i>
            <p>NETWORK WITH OTHER PARENTS AND INVITE TO MASTERY EVENTS</p>
          </div>
        </div>

        <div className="exp-row">
          <div className="col-cmn">
            <i class="fi fi-sr-share"></i>
            <p>SOCIAL MEDIA STORIES - FB AND INSTAGRAM</p>
          </div>
          <div className="col-cmn">
            <i class="fi fi-sr-users-alt"></i>
            <p>
              USE WORD-OF-MOUTH MARKETING TECHNIQUES, LIKE REFERRING OUR COMPANY
              TO FRIENDS
            </p>
          </div>
        </div>

        <div className="exp-row">
          <div className="col-cmn">
            <i class="fi fi-sr-thumbs-up"></i>
            <p>REGULAR ENGAGEMENT IN MASTERY SOCIAL MEDIA</p>
          </div>
          <div className="col-cmn">
            <i class="fi fi-sr-hand-holding-medical"></i>
            <p>SUPPORT MASTERY ONLINE IN LOCAL GROUPS</p>
          </div>
        </div>
      </div>

      <div className="mastry-brand-section">
        <div className="col-cm">
          <img src={ftrsection} alt="ftrsection"></img>
        </div>
        <div className="col-cm">
          <h1 className="mastry-heading">Become a Mastery</h1>
          <h1 className="brand_amb">
            Brand <br /> Ambassador
          </h1>
          <p>Are you Passionate about how Mastery has helped your family?</p>
          <p>Then we would love to have you as a Mastery Brand Ambassador.</p>
          <p className="exc">Enjoy some exclusive benefits and rewards.</p>
          <Link to={"/signin"} className="cta-button">
            Click Here To Enroll
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
