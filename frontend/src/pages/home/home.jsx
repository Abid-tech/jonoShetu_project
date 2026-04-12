import React from "react";
import "./home.css"

function Home() {

  return (
    <>

        <section id="banner">
            <div className="container">
                <div className="banner-txt">
                    <div className="row">
                        <div className="col-lg-12">
                            
                            <h1>নাগরিক <span>অধিকার চর্চা </span> করবেন<br/>  এখন আরো  সহজভাবে </h1>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <section id="monthly-report">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="monthly-top">
                            <h3>মাসিক অভি<span>যোগ দায়ে</span>রের তুলনা</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="monthly-content">
                            <h5> মাসের নাম : ফেব্রুয়ারি , ২০২৬</h5>
                            <h5>মোট অভিযোগ দায়ের : ৩৪৬</h5>
                            <h5>অভিযোগ সমাধান : ১৫৭</h5>
                            <h5>জেলাভিত্তিক সর্বোচ্চ অভিযোগ দায়ের : ঢাকা</h5>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="monthly-content">
                            <h5> মাসের নাম : জানুয়ারী , ২০২৬</h5>
                            <h5>মোট অভিযোগ দায়ের : ২০৫</h5>
                            <h5>অভিযোগ সমাধান : ৫৪</h5>
                            <h5>জেলাভিত্তিক সর্বোচ্চ অভিযোগ দায়ের : রাজশাহী</h5>
                        </div>
                    </div>
                </div>
                <div className="monthly-btn">
                    <button>বিস্তারিত জানুন</button>
                </div>
            </div>
        </section>


    </>
  )
}

export default Home
