/*---------------------------------------------------------------------
    File Name: slider-setting.js
---------------------------------------------------------------------*/

"use strict";
	var tpj = jQuery;

	var rev_api486;
	tpj(document).ready(function () {
		if (tpj("#rev_slider_486_1").revolution == undefined) {
			revslider_showDoubleJqueryError("#rev_slider_486_1");
		} else {
			rev_api486 = tpj("#rev_slider_486_1").show().revolution({
				sliderType: "standard",
				jsFileLocation: "revolution/js/",
				sliderLayout: "fullscreen",
				dottedOverlay: "none",
				delay: 5000,
				navigation: {
					keyboardNavigation: "on",
					keyboard_direction: "horizontal",
					mouseScrollNavigation: "off",
					mouseScrollReverse: "default",
					onHoverStop: "on",
					touch: {
						touchable: "on",
						swipe_threshold: 75,
						swipe_min_touches: 1,
						swipe_direction: "horizontal",
						drag_block_vertical: false
					},
					arrows: {
						  style: "gyres",
						  enable: true,
						  hide_mobile: false,
						  hide_leave: true,
						  hide_delay: 200,
						  hide_delay_mobile: 1200,
						  tmp: '',
						  left: {
							  h_align: "left",
							  v_align: "center",
							  h_offset: 0,
							  v_offset: 0
						  },
						  right: {
							  h_align: "right",
							  v_align: "center",
							  h_offset: 0,
							  v_offset: 0
						  }
					  },
					bullets: {
						enable: true,
						hide_mobile: true,
						hide_under: 800,
						style: "hebe",
						hide_leave: false,
						direction: "horizontal",
						h_align: "center",
						v_align: "bottom",
						h_offset: 0,
						v_offset: 30,
						space: 5,
						tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-imageoverlay"></span><span class="tp-bullet-title"></span>'
					}
				},
				viewPort: {
					enable: true,
					out_of: "pause",
					visible_area: "70%",
					pre_size: false
				},
				responsiveLevels: [1240, 1024, 778, 480],
				visibilityLevels: [1240, 1024, 778, 480],
				grid_width: [1240, 1024, 778, 480],
				grid_height: [500, 450, 400, 350],
				lazyType: "none",
				parallax: {
					type: "scroll",
					origin: "centerpoint",
					speed: 400,
					levels: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 46, 47, 48, 49, 50, 55],
					type: "scroll",
				},
				shadow: 0,
				spinner: "off",
				stopLoop: "off",
				stopAfterLoops: -1,
				stopAtSlide: -1,
				shuffle: "off",
				autoHeight: "off",
				hideThumbsOnMobile: "off",
				hideSliderAtLimit: 0,
				hideCaptionAtLimit: 0,
				hideAllCaptionAtLimit: 0,
				debugMode: false,
				fallbacks: {
					simplifyAll: "off",
					nextSlideOnWindowFocus: "off",
					disableFocusListener: false,
				}
			});
		}
	});