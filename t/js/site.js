var slaidide_arv = 0;
var current;
var counter = 0;
var viivis = 5;
var vahetan = 0;

$(document).ready(function (){
	$(".bg > div").each(function(){
		slaidide_arv += 1;
		$(this).addClass("nr" + slaidide_arv);
	});
	vahetaSlaidi(1);
	isevahetaja();
});
function isevahetaja()
{
	setTimeout("isevahetaja()", 1000);
	counter += 1;
	if(counter == viivis) {
		counter = 0;
		if(current < slaidide_arv){
			vahetaSlaidi( parseInt(current) + 1);
		} else {
			vahetaSlaidi(1);
		}
	}
}
function vahetaSlaidi(n) {
	vahetan = 1;
	$(".nr"+ n).show();
	$(".nr"+ n).animate({opacity:1}, 800, function(){
		vahetan = 0;
	});
	$(".nr"+ n).siblings("div").animate({opacity:0}, 800, function(){
		$(this).hide();
	});
	counter = 0;
	current = n;
}