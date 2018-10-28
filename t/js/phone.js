

window.external.InitScriptInterface();
SitePhone = SiteKiosk.Plugins("SitePhone");

var timeoutStatus;

//SitePhone.State flags
var S_OFFLINE = 0;
var S_CONNECTING = 1;
var S_PAUSING = 2;
var S_ONLINE = 3;

//SitePhone.CallStatus flags
var CS_UNPLACED = 0;
var CS_ROUTING = 1;
var CS_EARLY_MEDIA = 2;
var CS_FAILED = 3;
var CS_RINGING = 4;
var CS_IN_PROGRESS = 5;
var CS_ON_HOLD = 6;
var CS_FINISHED = 7;
var CS_MISSED = 8;
var CS_REFUSED = 9;
var CS_BUSY = 10;
var CS_CANCELLED = 11;
var CS_LOCAL_HOLD = 12;
var CS_REMOTE_HOLD = 13;
var CS_VOICEMAIL_BUFFERING_GREETING = 14;
var CS_VOICEMAIL_PLAYING_GREETING = 15;
var CS_VOICEMAIL_RECORDING = 16;
var CS_VOICEMAIL_UPLOADING = 17;
var CS_VOICEMAIL_SENT = 18;
var CS_VOICEMAIL_CANCELLED = 19;
var CS_VOICEMAIL_FAILED = 20;
var CS_TRANSFERRING = 21;
var CS_TRANSFERRED = 22;

function OnBodyLoad()
{
	//Initialize events
	SitePhone.OnStateChanged = OnStateChanged;
	SitePhone.OnCallStateChanged = OnCallStateChanged;
	SitePhone.OnCallDurationChanged = OnCallDurationChanged;
	OnStateChanged();
	OnCallStateChanged();
	OnCallDurationChanged();

	$('#CallBtns .button').click(function(){
		number_to_call = $(this).attr('attr-number');
		OnCallBtnClick(number_to_call);
	});
	$('#FinishCallBtn').click(function(){
		OnFinishCallBtnClick();
	});
}

function OnStateChanged()
{
	switch (SitePhone.State)
	{
		case S_OFFLINE:
		StateDiv.innerHTML = "Offline";
		break;
		case S_CONNECTING:
		StateDiv.innerHTML = "Connecting";
		break;
		case S_PAUSING:
		StateDiv.innerHTML = "Pausing";
		break;
		case S_ONLINE:
		StateDiv.innerHTML = "Online";
		break;
		default:
		StateDiv.innerHTML = "Unknown";
	}

	switch (SitePhone.State)
	{
		case S_ONLINE:
		//CallBtn.disabled = false;
		$('#CallBtns').show();
		break;
		default:
		//CallBtn.disabled = true;
		$('#CallBtns').hide();
	}
}

function OnCallStateChanged()
{
	switch (SitePhone.CallStatus)
	{
		case CS_ON_HOLD:
		case CS_LOCAL_HOLD:
		case CS_REMOTE_HOLD:
		$('#CallStatusDiv').html("Kõne on ootel");
		break;
		case CS_ROUTING:
		$('#CallStatusDiv').html("Ühendan...");
		break;
		case CS_RINGING:
		$('#CallStatusDiv').html("Kutsub...");
		break;
		case CS_IN_PROGRESS:
		$('#CallStatusDiv').html("Kõne");
		case CS_FINISHED:
		$('#CallStatusDiv').html("Kõne lõpetatud");
		break;
		case CS_FAILED:
		case CS_REFUSED:
		case CS_MISSED:
		$('#CallStatusDiv').html("Kõne ebaõnnestus");
		break;
	}

	switch (SitePhone.CallStatus)
	{
		case CS_RINGING:
		case CS_ROUTING:
		case CS_IN_PROGRESS:
		case CS_ON_HOLD:
		case CS_LOCAL_HOLD:
		case CS_REMOTE_HOLD:
			//FinishCallBtn.disabled = false;
			window.clearTimeout(timeoutStatus);
			$('#CallBtns').hide();
			$('#FinishCallBtn').show();
			$('#CallStatusDiv').addClass('active');
		break;
		case CS_FINISHED:
		case CS_FAILED:
		case CS_REFUSED:
		case CS_MISSED:
			$('#FinishCallBtn').hide();
			$('#CallBtns').show();
			timeoutStatus = window.setTimeout(function(){
				$('#CallStatusDiv').removeClass('active');
			}, 2000);
		break;
		default:
			//FinishCallBtn.disabled = true;
			$('#FinishCallBtn').hide();
			$('#CallBtns').show();
			$('#CallStatusDiv').removeClass('active');
	}
}

function OnCallDurationChanged()
{
	CallDurationDiv.innerHTML = SitePhone.CallDuration;
}

function OnCallBtnClick(destination)
{
	try
	{
		/*destination = DestinationTb.value;*/
		if (SitePhone.IsCalleeAllowed(destination))
		SitePhone.StartCall(destination);
	}
	catch(e){}
}

function OnFinishCallBtnClick()
{
	SitePhone.FinishCall();
}


$(document).ready(function (){
	setTimeout(OnBodyLoad, 5000);
});