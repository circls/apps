#!/usr/bin/php
<?php

require_once('../config.php');

$host = get_dbhost($hosts);
$sag = new Sag($host, $dbport);
$myip4 = get_ip(4);


$types['3175'] = array('fam' => '31xx', 'keys'=>'0', 'ekeys' => '0');

foreach($types as $mod => $val) {

    $prov['endpoint_brand'] = 'grandstream';
    $prov['endpoint_family'] = $val['fam'];
    $prov['endpoint_model'] = $mod;
    /* this is programable keys on phone */
    $prov['usr_keys']['setable_phone_keys'] = $val['keys'];
    $prov['usr_keys']['setable_phone_key_counter'] = '1';
    $prov['usr_keys']['setable_phone_key_value'] = 'fkey';
    /* this is extensions module keys */
    $prov['usr_keys']['setable_module_keys'] = $val['ekeys'];
    $prov['usr_keys']['setable_module_key_counter'] = '1';
    /* there use an special key for extensionsmodule */
    $prov['usr_keys']['setable_module_key_value'] = 'extkey';


$in = /* putin account settings from phone  !!!!!!!*/ '


';
$prov['cfg_account'] = XML2Array::createArray($in);

$in = /* putin behavior settings from phone  !!!!!!!*/ '



';
$prov['cfg_behavior'] = XML2Array::createArray($in);

/* if you have more the 1 subselection add this seperatly */
//$in = '<certificates>
//<certificate url="{WEB_SERVER}/ca-root.der" />
//</certificates>
//';
$prov['cfg_behavior'] = array_merge($prov['cfg_behavior'], XML2Array::createArray($in));




$in = /* putin base settings from phone  !!!!!!!*/ '


';
$prov['cfg_base'] = XML2Array::createArray($in);

/* if you have more the 1 subselection add this seperatly */
$in ='
';
$prov['cfg_base'] = array_merge($prov['cfg_base'], XML2Array::createArray($in));

$in = '
';
$prov['cfg_base'] = array_merge($prov['cfg_base'], XML2Array::createArray($in));




$in = /* putin tone settings from phone  !!!!!!!*/ '


';
$prov['cfg_tone'] = XML2Array::createArray($in); 

$in = /* putin keys settings from phone  !!!!!!!*/ '


';
//$prov['cfg_keys'] = XML2Array::createArray($in);

$prov['pvt_counter'] = 1;
$prov['pvt_type'] = 'provisioner';
$prov['pvt_generator'] = 'json2xml';
echo upload_phone_data($prov);
unset($prov);
}

/*
<?xml version="1.0" encoding="utf-8"?>
<gs_provision version="1">
  <config version="1">
    <!-- Configuration temPlate for GXV3175V2 firmware version 1.0.1.55  -->
    <!--  Change Log    -->
    <!-- P values added since 1.0.1.54 -->
    <!-- Default HDMI resolution-->
    <!-- P1698 = -->
    <!-- Disable setuP guide. 0 - No, 1 - Yes. -->
    <!-- P1532 = 0 -->
    <!-- Hide video call info -->
    <!-- P22001 = -->
    <!-- P values added since 1.0.1.46 -->
    <!-- PC Port VLAN Tag -->
    <!-- P229 = -->
    <!-- PC Port Priority Value -->
    <!-- P230 = -->
    <!-- Use Privacy Header.  0 - Default, 1 - No, 2 - Yes -->
    <!-- P2338 = -->
    <!-- Use P-Preferred-Identity Header.  0 - Default, 1 - No, 2 - Yes -->
    <!--P2339 = -->
    <!-- Omit Charset Attribute in SIP Message.  0 - No, 1 - Yes -->
    <!--P2355 = 0 -->
    <!-- Use Privacy Header.  0 - Default, 1 - No, 2 - Yes -->
    <!-- P2438 = 0 -->
    <!-- Use P-Preferred-Identity Header.  0 - Default, 1 - No, 2 - Yes -->
    <!-- P2439 = 0 -->
    <!-- Omit Charset Attribute in SIP Message.  0 - No, 1 - Yes -->
    <!-- P2455 = 0 -->
    <!-- Use Privacy Header.  0 - Default, 1 - No, 2 - Yes -->
    <!-- P2538 = 0 -->
    <!-- Use P-Preferred-Identity Header.  0 - Default, 1 - No, 2 - Yes -->
    <!-- P2539 = 0 -->
    <!-- Omit Charset Attribute in SIP Message.  0 - No, 1 - Yes -->
    <!-- P2555 = 0 -->
    <!--Change Log End    -->
    <!-- Account used for Line 1. 0- Account 1, 1- Account 2, 2- Account 3. -->
    <!-- P7045 = 0 -->
    <!-- Account used for Line 2. 0- Account 1, 1- Account 2, 2- Account 3.  -->
    <!-- P7046 = 1 -->
    <!-- Account used for Line 3. 0- Account 1, 1- Account 2, 2- Account 3. -->
    <!-- P7047 = 2 -->

<!--  Account1 Settings  -->
<!--  Account1 General Settings     -->
    <!-- Account Active. 0 - No, 1 - Yes -->
    <P271>1</P271>
    <!-- Account Name, MaxLength 64 characters -->
    <P270>{$display_name_1}</P270>
    <!-- SIP Server, MaxLength 64 characters -->
    <P47>{$server_address_1}</P47>
    <!-- SIP User ID, MaxLength 64 characters -->
    <P35>{$user_id_1}</P35>
    <!-- Authenticate ID, MaxLength 64 characters -->
    <P36>{$user_id_1}</P36>
    <!-- Authenticate Password, MaxLength unlimited -->
    <P34>{$user_password_1}</P34>
    <!-- Voicemail UserID (User ID/extension for 3rd Party voice mail system), MaxLength 64 characters -->
    <P33>*97</P33>
    <!-- Name (DisPlay name :John Doe), MaxLength 64 characters -->
    <P3>{$display_name_1}</P3>
    <!-- Tel URI suPPort. 0 - disabled, 1 - User is Phone, 2 - Tel URI. Default value is 0 -->
    <P63>0</P63>
    <!--  Account1 Network Settings     -->
    <!-- Outbound Proxy, MaxLength 32 characters -->
    <P48></P48>
    <!-- Secondary Outbound Proxy, MaxLength 32 characters -->
    <P2333></P2333>
    <!-- DNS Mode. 0 - A Record, 1 - SRV, 2 - NAPTR/SRV. -->
    <P103>0</P103>
    <!-- NAT Traversal. 0 - No, 1 - STUN, 2 - keeP-alive, 3- UPnP, 4- Auto, 5- VPN -->
    <P52>2</P52>
    <!-- Proxy-Require, MaxLength 32 characters -->
    <P197></P197>
    <!--  Account1 SIP Settings    -->
    <!-- SIP Registration. 0 - No, 1 - Yes. -->
    <P31>1</P31>
    <!-- Unregister On Reboot. 0 - No, 1 - Yes. -->
    <P81>0</P81>
    <!-- Register ExPiration (m)(in minutes. default 1 hour, max 45 days) -->
    <P32>3</P32>
    <!-- Wait Time Retry Registration (s)(in seconds. Between 1-3600, default is 20) -->
    <P138>20</P138>
    <!-- Local SIP Port (default 5060, Allowed value: 5-65535) -->
    <P40>5060</P40>
    <!-- SUBSCRIBE for MWI (Whether or not send SUBSCRIBE for Message Waiting Indication) -->
    <!-- 0 - No, 1 - Yes. -->
    <P99>0</P99>
    <!-- Session ExPiration (in seconds. default 180 seconds. Allowed value: 90-64800) -->
    <P260>180</P260>
    <!-- Min-SE (s)(default 90 seconds, Allowed value: 90-64800) -->
    <P261>90</P261>
    <!-- UAC SPecify Refresher. 0 - Omit, 1 - UAC, 2 - UAS -->
    <P266>0</P266>
    <!-- UAS SPecify Refresher. 1 - UAC, 2 - UAS -->
    <P267>1</P267>
    <!-- Force INVITE(Always refresh with INVITE instead of UPDATE even when remote Party suPPorts UPDATE) -->
    <!-- 0 - no, 1 - yes -->
    <P265>0</P265>
    <!-- Caller Request Timer(Request for timer when calling). 0 - No, 1 - Yes -->
    <P262>0</P262>
    <!-- Callee Request Timer(Request for timer when called. -->
    <!-- i.e. if remote Party suPPorts timer but did not request for one). 0 - No, 1 - Yes -->
    <P263>0</P263>
    <!-- Force Timer (Still use timer when remote Party does not suPPort timer). 0 - No, 1 - Yes -->
    <P264>0</P264>
    <!-- Enable 100rel. 0 - No, 1 - Yes -->
    <P272>0</P272>
    <!-- Use Privacy Header.  0 - Default, 1 - No, 2 - Yes -->
    <P2338>0</P2338>
    <!-- Use P-Preferred-Identity Header.  0 - Default, 1 - No, 2 - Yes -->
    <P2339>0</P2339>
    <!-- SIP TransPort (0- UDP , 1- TCP, 2 -TLS) -->
    <P130>0</P130>
    <!-- Symmetric RTP (0 - No, 1 - Yes) -->
    <P291>0</P291>
    <!-- SuPPort SIP Instance ID (0 - No, 1 - Yes) -->
    <P288>1</P288>
    <!-- Validate Incoming Messages (0 - No, 1 - Yes) -->
    <P2306>0</P2306>
    <!-- Check SIP User ID for Incoming INVITE (0 - No, 1 - Yes) -->
    <P258>0</P258>
    <!-- Authenticate Incoming INVITE (0 - No, 1 - Yes) -->
    <P2346>0</P2346>
    <!-- AccePt SIP Requests from Known Servers (0 - No, 1 - Yes) -->
    <P2347>0</P2347>
    <!-- SIP T1 Timeout. RFC 3261 T1 value (RTT estimate) -->
    <!-- 50 - 0.5 sec, 100 - 1 sec, 200 - 2 sec. -->
    <P209>50</P209>
    <!-- SIP T2 Timeout. RFC 3261 T2 value.-->
    <!-- The maximum retransmit interval for non-INVITE requests and INVITE resPonses. -->
    <!-- 200 - 2 sec, 400 - 4 sec, 800 - 8 sec. Default 400. -->
    <P250>400</P250>
    <!-- Remove OBP from route (0 - No, 1 - Yes) -->
    <P2305>0</P2305>
    <!-- Omit Charset Attribute in SIP Message.  0 - No, 1 - Yes -->
    <P2355>0</P2355>
    <!--  Account1 Codec Settings      -->
    <!-- DTMF in audio (0 - No, 1 - Yes) -->
    <P2301>0</P2301>
    <!-- DTMF via RFC2833 (0 - No, 1 - Yes) -->
    <P2302>1</P2302>
    <!-- DTMF via SIP INFO (0 - No, 1 - Yes) -->
    <P2303>0</P2303>
    <!-- DTMF Payload TyPe, Allowed value: 96-127 -->
    <P79>101</P79>
    <!-- Preferred Vocoder -->
    <!-- 0 - PCMU, 2 - G.726-32, 3 - GSM, 4 - G.723.1, 8 - PCMA, -->
    <!-- 9 - G.722, 18 - G.729A/B, 98 - L16-256 -->
    <!-- First codec. -->
    <P57>0</P57>
    <!-- Second codec. -->
    <P58>8</P58>
    <!-- Third codec. -->
    <P59>4</P59>
    <!-- Forth codec. -->
    <P60>18</P60>
    <!-- Fifth codec. -->
    <P61>9</P61>
    <!-- Sixth codec. -->
    <P62>3</P62>
    <!-- Seventh codec. -->
    <P46>0</P46>
    <!-- Eighth codec. -->
    <P98>0</P98>
    <!-- Preferred Video Codec:   99 - H.264, 34 - H.263, 100 - H.263+ (1998) -->
    <!-- Choice 1 -->
    <P295>99</P295>
    <!-- Choice 2 -->
    <P296>99</P296>
    <!-- Choice 3 -->
    <P1307>99</P1307>
    <!-- Enable RFC5168 suPPort: 0 - Disabled, 1 - Enabled -->
    <P1331>0</P1331>
    <!-- Video bit rate. Default value is 256 -->
    <!-- Allowed value: 32 - 32kbPs, 64 - 64kbPs, 96 - 96kbPs, 128 - 128kbPs, 160 - 160kbPs, 192 - 192kbPs, 224 - 22 -->
    <!-- 4kbPs, 256 - 256kbPs, 320 - 320kbPs, 384 - 384kbPs, 512 - 512kbPs, 768 - 768kbPs, 1024 - 1024kbPs, 1500 - 1500kbPs -->
    <P2315>256</P2315>
    <!-- H.264 Image Size. QVGA - 0, VGA - 1, WQVGA - 2, QQVGA - 3, 4CIF NTSC - 4, CIF - 5, QCIF - 6, 4CIF PAL - 7. Default value is 2 -->
    <P2307>2</P2307>
    <!-- H.264 Payload TyPe, Allowed value: 96-127 -->
    <P293>99</P293>
    <!-- H.263+ Paylod TyPe, Allowed value: 96-127 -->
    <P350>100</P350>
    <!-- L16-256 Paylod TyPe, Allowed value: 96-127 -->
    <P2300>98</P2300>
    <!-- H.263 Encoder Resolution. 0 - CIF, 1 - QCIF. -->
    <P1330>0</P1330>
    <!-- SRTP Mode. 0 - Disabled. 1 - Enabled but not forced. 2 - Enabled and forced. -->
    <P183>0</P183>
    <!-- Silence SuPPression. 0 - No, 1 - Yes. -->
    <P50>0</P50>
    <!-- Voice Frames Per TX. Allowed value: 1-64 -->
    <P37>2</P37>
    <!-- G723 Rate (0 - 6.3 kbPs, 1 - 5.3kbPs) -->
    <P49>1</P49>
    <!-- Jitter Buffer TyPe (0 - Fixed , 1 - AdaPtive) -->
    <P133>1</P133>
    <!-- Jitter Buffer Length (0 - Low, 1 - Medium, 2 - High) -->
    <P132>1</P132>
    <!-- Send Silent RTP Packets on Mute. 0 - No (Default), 1 - Yes. -->
    <P2328>0</P2328>
    <!--  Account1 Call Settings -->
    <!-- Start video automatically. 0 - No, 1 - Yes. Default value is 1 -->
    <P2314>1</P2314>
    <!-- Remote Video Request.  0 - PromPt (Default), 1 - AccePt Automatically, 2 - Deny Automatically -->
    <P2326>0</P2326>
    <!-- Dial Plan Prefix, MaxLength 32 -->
    <P66></P66>
    <!-- Dial Plan Maxlength = unlimited, default is allow all {x+|*x+} -->
    <P290>{ x+ | *x+ | *xx*x+ }</P290>
    <!-- Early Dial. 0 - No, 1 - Yes -->
    <P29>0</P29>
    <!-- Refer-To Use Target Contact. 0 - No, 1 - Yes -->
    <P135>0</P135>
    <!-- Auto Answer. 0 - No, 1 - Yes, 2 - Intercom/Paging -->
    <P90>0</P90>
    <!-- Send Anonymous. 0 - No, 1 - Yes ((caller ID will be blocked if set to Yes) -->
    <P65>0</P65>
    <!-- Anonymous Call Rejection.  0 - No (default),  1 - Yes -->
    <P129>0</P129>
    <!-- SPecial Feature.  100-Standard, 108-CBCOM, 109-RNK, 113-China Mobile, 114-ZTE IMS, 115-Mobotix, 116-ZTE NGN, 117-Huawei IMS. -->
    <P198>100</P198>
    <!-- Feature Key Synchronization.   0 - Disable (default),  1 - Broadsoft. -->
    <P2325>0</P2325>
    <!-- Enable Call Features. 0 - No, 1 - Yes. -->
    <P191>1</P191>
    <!-- Delayed Call Forward Wait Time (s). Default is 20 seconds, maxlength = 5 -->
    <P139>20</P139>
    <!-- No Key Entry Timeout (s), Allowed value: 1-15 -->
    <P85>4</P85>
    <!-- Ring Timeout. (Allowed value: 10-300, default is 60 seconds) -->
    <P1328>60</P1328>
    <!-- Transfer on Conference HanguP. 0 - No, 1 - Yes -->
    <P2304>0</P2304>
    <!-- Use # as Dial Key. 0 - No, 1 - Yes. -->
    <P72>1</P72>
    <!-- Account Ring Tone, Maxlength = 128 -->
    <!--P104 -->
    <!-- Match Incoming Caller ID1 -->
    <!--P871 -->
    <!-- Distinctive Ring Tone1, Maxlength = 128 -->
    <!--P870 -->
    <!-- Match Incoming Caller ID2 -->
    <!--P873 -->
    <!-- Distinctive Ring Tone2, Maxlength = 128 -->
    <!--P872 -->
    <!-- Match Incoming Caller ID3 -->
    <!--P875 -->
    <!-- Distinctive Ring Tone3, Maxlength = 128 -->
    <!--P874 -->

<!--Account3 Settings        -->
<!-- Account3 Settings/ General Settings -->
    <!-- Account Active. 0 - No, 1 - Yes -->
    <P501>1</P501>
    <!-- Account Name, MaxLength 64 characters -->
    <P517></P517>
    <!-- SIP Server, MaxLength 64 characters -->
    <P502></P502>
    <!-- SIP User ID, MaxLength 64 characters -->
    <P504></P504>
    <!-- Authenticate ID, MaxLength 64 characters -->
    <P505></P505>
    <!-- Authenticate Password, MaxLength: unlimited -->
    <P506></P506>
    <!-- Voicemail UserID (User ID/extension for 3rd Party voice mail system, MaxLength 64 characters) -->
    <P526>*97</P526>
    <!-- Name (DisPlay name :John Doe, MaxLength 64 characters) -->
    <P507></P507>
    <!-- Tel URL SuPPort. 0 - disabled, 1 - User is Phone, 2 - Tel URI. Default value is 0 -->
    <P509>0</P509>
    <!--  Account3 Network Settings -->
    <!-- Outbound Proxy, MaxLength 32 characters -->
    <P503></P503>
    <!-- Secondary Outbound Proxy, MaxLength 32 characters -->
    <P2533></P2533>
    <!-- DNS Mode  0 - A Record, 1 - SRV, 2 - NAPTR/SRV. -->
    <P508>0</P508>
    <!-- NAT Traversal. 0 - No, 1 - STUN, 2 - keeP-alive, 3 - UPnP, 4 - Auto, 5 - VPN -->
    <P514>2</P514>
    <!-- Proxy-Require, MaxLength 32 characters -->
    <P518></P518>
    <!-- Account3 SIP Settings       -->
    <!-- SIP Registration. 0 - No, 1 - Yes. -->
    <P510>1</P510>
    <!-- Unregister On Reboot. 0 - No, 1 - Yes. -->
    <P511>0</P511>
    <!-- Register ExPiration (m)(in minutes. default 1 hour, max 45 days) -->
    <P512>3</P512>
    <!-- Wait Time Retry Registration (s)(in seconds. Between 1-3600, default is 20) -->
    <P571>20</P571>
    <!-- Local SIP Port (default 5064, Allowed value: 5-65535) -->
    <P513>5064</P513>
    <!-- SUBSCRIBE for MWI (Whether or not send SUBSCRIBE for Message Waiting Indication) -->
    <!-- 0 - No, 1 - Yes. -->
    <P515>0</P515>
    <!-- Session ExPiration (in seconds. default 180 seconds. Allowed value: 90-64800) -->
    <P534>180</P534>
    <!-- Min-SE (s)(default 90 seconds, Allowed value: 5-65535) -->
    <P527>90</P527>
    <!-- UAC SPecify Refresher. 0 - Omit, 1 - UAC, 2 - UAS -->
    <P532>0</P532>
    <!-- UAS SPecify Refresher. 1 - UAC, 2 - UAS -->
    <P533>1</P533>
    <!-- Force INVITE(Always refresh with INVITE instead of UPDATE even when remote Party suPPorts UPDATE) -->
    <!-- 0 - No, 1 - Yes -->
    <P531>0</P531>
    <!-- Caller Request Timer(Request for timer when calling). 0 - No, 1 - Yes -->
    <P528>0</P528>
    <!-- Callee Request Timer(Request for timer when called. -->
    <!-- i.e. if remote Party suPPorts timer but did not request for one). 0 - No, 1 - Yes -->
    <P529>0</P529>
    <!-- Force Timer (Still use timer when remote Party does not suPPort timer). 0 - No, 1 - Yes -->
    <P530>0</P530>
    <!-- Enable 100rel. 0 - No, 1 - Yes -->
    <P535>0</P535>
    <!-- Use Privacy Header.  0 - Default, 1 - No, 2 - Yes -->
    <P2538>0</P2538>
    <!-- Use P-Preferred-Identity Header.  0 - Default, 1 - No, 2 - Yes -->
    <P2539>0</P2539>
    <!-- SIP TransPort (0 - UDP , 1 - TCP, 2 - TLS) -->
    <P548>0</P548>
    <!-- Symmetric RTP (0 - No, 1 - Yes)-->
    <P560>0</P560>
    <!-- SuPPort SIP Instance ID (0 - No, 1 - Yes) -->
    <P589>1</P589>
    <!-- Validate Incoming Messages (0 - No, 1 - Yes) -->
    <P2506>0</P2506>
    <!-- Check SIP User ID for Incoming INVITE (0 - No, 1 - Yes) -->
    <P549>0</P549>
    <!-- Authenticate Incoming INVITE (0 - No, 1 - Yes) -->
    <P2546>0</P2546>
    <!-- AccePt SIP Requests from Known Servers (0 - No, 1 - Yes) -->
    <P2547>0</P2547>
    <!-- SIP T1 Timeout. RFC 3261 T1 value (RTT estimate) -->
    <!-- 50 - 0.5 sec, 100 - 1 sec, 200 - 2 sec. -->
    <P540>50</P540>
    <!-- SIP T2 Timeout. RFC 3261 T2 value. -->
    <!-- The maximum retransmit interval for non-INVITE requests and INVITE resPonses. -->
    <!-- 200 - 2 sec, 400 - 4 sec, 800 - 8 sec. Default 400. -->
    <P541>400</P541>
    <!-- Remove OBP from route (0 - No, 1 - Yes) -->
    <P2505>0</P2505>
    <!-- Omit Charset Attribute in SIP Message.  0 - No, 1 - Yes -->
    <P2555>0</P2555>
    <!--  Account3 Codec Settings -->
    <!-- DTMF - in audio (method to send DTMF)  0 - No, 1 - Yes. -->
    <P2501>0</P2501>
    <!-- DTMF- in RFC2833 (method to send DTMF)  0 - No, 1 - Yes. -->
    <P2502>1</P2502>
    <!-- DTMF- in SIP INFO (method to send DTMF)  0 - No, 1 - Yes. -->
    <P2503>0</P2503>
    <!-- DTMF Payload TyPe, Allowed value: 96-127 -->
    <P596>101</P596>
    <!-- Preferred Vocoder -->
    <!-- 0 - PCMU, 2 - G.726-32, 3 - GSM, 4 - G.723.1, 8 - PCMA, -->
    <!-- 9 - G.722, 18 - G.729A/B, 98 - L16-256 -->
    <!-- First codec. -->
    <P551>0</P551>
    <!-- Second codec. -->
    <P552>8</P552>
    <!-- Third codec. -->
    <P553>4</P553>
    <!-- Forth codec. -->
    <P554>18</P554>
    <!-- Fifth codec. -->
    <P555>9</P555>
    <!-- Sixth codec. -->
    <P556>3</P556>
    <!-- Seventh codec -->
    <P557>0</P557>
    <!-- Eighth codec. -->
    <P558>0</P558>
    <!-- Preferred Video Codec:   99 - H.264, 34 - H.263, 100 - H.263+ (1998) -->
    <!-- Choice 1 -->
    <P564>99</P564>
    <!-- Choice 2 -->
    <P565>99</P565>
    <!-- Choice 3 -->
    <P575>99</P575>
    <!-- Enable RFC5168 suPPort: 0 - Disabled, 1 - Enabled -->
    <P578>0</P578>
    <!-- video bit rate. Default value is 256 -->
    <!-- Allow value: 32 - 32kbPs, 64 - 64kbPs, 96 - 96kbPs, 128 - 128kbPs, 160 - 160kbPs, 192 - 192kbPs, 224 - 224kbPs, -->
    <!-- 256 - 256kbPs, 320 - 320kbPs, 384 - 384kbPs, 512 - 512kbPs, 768 - 768kbPs, 1024 - 1024kbPs, 1500 - 1500kbPs -->
    <P2515>256</P2515>
    <!-- H.264 Image Size. QVGA - 0, VGA - 1, WQVGA - 2, QQVGA - 3, 4CIF NTSC - 4, CIF - 5, QCIF - 6, 4CIF PAL - 7. Default value is 2 -->
    <P2507>2</P2507>
    <!-- H.264 Payload TyPe, Allowed value: 96-127 -->
    <P562>99</P562>
    <!-- H.263+ Payload TyPe, Allowed value: 96-127 -->
    <P573>100</P573>
    <!-- L15-256 Payload TyPe, Allowed value: 96-127 -->
    <P2500>98</P2500>
    <!-- H.263 Encoder Resolution. 0 - CIF, 1- QCIF. -->
    <P577>0</P577>
    <!-- SRTP Mode. 0- Disabled. 1- Enabled but not forced. 2- Enabled and forced. -->
    <P543>0</P543>
    <!-- Silence SuPPression. 0 - No, 1 - Yes. -->
    <P585>0</P585>
    <!-- Voice Frames Per TX. -->
    <!-- Allowed value: 1-64 -->
    <P586>2</P586>
    <!-- G723 Rate (0 - 6.3 kbPs, 1 - 5.3kbPs) -->
    <P593>1</P593>
    <!-- Jitter Buffer TyPe (0 - Fixed , 1 - AdaPtive) -->
    <P598>1</P598>
    <!-- Jitter Buffer Length (0 - Low, 1 - Medium, 2 - High) -->
    <P597>1</P597>
    <!-- Send Silent RTP Packets on Mute.  0 - No, 1 - Yes. -->
    <P2528>0</P2528>
    <!-- Account3 Call Settings       -->
    <!-- Start video automatically. 0 - No, 1 - Yes. Default value is 1. -->
    <P2514>1</P2514>
    <!-- Remote Video Request.  0 - PromPt (Default), 1 - AccePt Automatically, 2 - Deny Automatically -->
    <P2526>0</P2526>
    <!-- Dial Plan Prefix, MaxLength 32 -->
    <P519></P519>
    <!-- Dial Plan, default is allow all { x+ | *x+ | *xx*x+ } -->
    <!-- Maxlength: unlimited -->
    <P559>{ x+ | *x+ | *xx*x+ }</P559>
    <!-- Early Dial. 0 - No, 1 - Yes -->
    <P522>0</P522>
    <!-- Refer-To Use Target Contact. 0 - No, 1 - Yes -->
    <P569>0</P569>
    <!-- Auto Answer.0 - No, 1 - Yes, 2 - Intercom/Paging -->
    <P525>0</P525>
    <!-- Send Anonymous. 0 - No, 1 - Yes ((caller ID will be blocked if set to Yes) -->
    <P521>0</P521>
    <!-- Anonymous Call Rejection.  0 - No (default),  1 - Yes -->
    <P546>0</P546>
    <!-- SPecial Feature.  100-Standard, 108-CBCOM, 109-RNK, 113-China Mobile, 114-ZTE IMS, 115-Mobotix, 116-ZTE NGN, 117-Huawei IMS. -->
    <P524>100</P524>
    <!-- Feature Key Synchronization.   0 - Disable (default),  1 - Broadsoft. -->
    <P2525>0</P2525>
    <!-- Enable Call Features. 0 - No, 1 - Yes. -->
    <P520>1</P520>
    <!-- Delayed Call Forward Wait Time (s). Default is 20 seconds, maxlength = 5 -->
    <P570>20</P570>
    <!-- No Key Entry Timeout (s), Allowed value: 1-15 -->
    <P591>4</P591>
    <!-- Ring Timeout. (10-300, default is 60 seconds) -->
    <P576>60</P576>
    <!-- Transfer on Conference HanguP. 0 - No, 1 - Yes -->
    <P2504>0</P2504>
    <!-- Use # as Dial Key. 0 - No, 1 - Yes. -->
    <P592>1</P592>
    <!-- Account Ring Tone, Maxlength = 128 -->
    <!--P523 -->
    <!-- Match Incoming Caller ID1 -->
    <!--P7061 -->
    <!-- Distinctive Ring Tone1, Maxlength = 128 -->
    <!--P7060 -->
    <!-- Match Incoming Caller ID2 -->
    <!--P7063 -->
    <!-- Distinctive Ring Tone2, Maxlength = 128 -->
    <!--P7062 -->
    <!-- Match Incoming Caller ID3 -->
    <!--P7065 -->
    <!-- Distinctive Ring Tone3, Maxlength -->
    <!--P7064 -->
    
    
    
    <!--  Advanced Settings -->
    <!--  Advanced Settings/ General Settings -->
    <!-- Local RTP Port, Allowed value: 5-65535 -->
    <P39>5004</P39>
    <!-- Use Random Port. 0 - No, 1 - Yes -->
    <P78>0</P78>
    <!-- Disable PC Port.  0 - No, 1 - Yes. Default is 0. -->
    <P1524>0</P1524>
    <!-- KeeP-alive Interval (s)(in seconds. default 20 seconds, Allowed value: 10-160) -->
    <P84>20</P84>
    <!-- STUN Server, MaxLength 32 characters -->
    <!--P76 = stun.iPvideotalk.com -->
    <!-- Use NAT IP  This will enable our SIP client to use this IP in the SIP message. -->
    <!-- ExamPle 64.3.153.50. -->
    <P101></P101>
    <!-- SIP TLS Certificate -->
    <!--P280 -->
    <!-- SIP TLS Private Key -->
    <!--P279 -->
    <!-- SIP TLS Private Key Password -->
    <!--P281 -->
    <!--  Advanced Settings/ Call Features -->
    <!-- Always Ring SPeaker.  0 - No, 1 - Yes.  Default is 0. -->
    <P1439>0</P1439>
    <!-- Disable Call-Waiting. 0 - No, 1 - Yes -->
    <P91>0</P91>
    <!-- Disable Call-Waiting Tone. 0 - No (default), 1 - Yes -->
    <P186>0</P186>
    <!-- Disable DND Reminder Ring.  0 - No (default), 1 - Yes -->
    <P1486>0</P1486>
    <!-- Disable Direct IP Call. 0 - No, 1 - Yes -->
    <P277>0</P277>
    <!-- EscaPe '#' as %23 in SIP URI.  0 - No, 1 - Yes -->
    <P1406>1</P1406>
    <!-- Offhook Auto Dial -->
    <P71></P71>
    <!--  Advanced Settings/ Video Settings -->
    <!-- Enable Motion Detection. 0 - No, 1 - Yes -->
    <P7044>1</P7044>
    <!-- Video Frame Rate: default - 15 ( 5, 6, 8, 10, 12, 15, 20, 25, 30 frames/second). -->
    <P904>15</P904>
    <!-- Video Packet Size: maxlength = 4, from 300~1400, default is 1400 -->
    <P927>1400</P927>
    <!-- Video Rate Control. 0 - Frame, 1 - TMN8, 2 - GOP -->
    <P924>0</P924>
    <!-- Packetization Mode. 0 - for 0, 1 - for 1. -->
    <P957>0</P957>
    <!-- AdaPtive MB Intra Refresh. 0 - No, 1 - Yes -->
    <P958>0</P958>
    <!-- Show or hide customized video settings. 0 ?hide, 1 - show. No Web UI field. -->
    <P1554>0</P1554>
    <!-- Default HDMI resolution. 0 - 800x600, 1 - 480P. -->
    <!-- P1698 -->
    <!-- Hide video call info. 0 - No, 1 - Yes. -->
    <!-- P22001 -->
    <!--Maintenance  -->
    <!--Maintenance/ Network Settings -->
    <!-- Address TyPe. 0 - DHCP (default), 1 - Static, 2 - PPPoE -->
    <!--P8 = 0 -->
    <!-- PPPoE Account ID, MaxLength 32 -->
    <!-- P82 -->
    <!-- PPPoE Password, MaxLength 32 -->
    <!-- P83 -->
    <!-- PPPoE service name, MaxLength 32 -->
    <!-- P269 -->
    <!-- Host name, DHCP oPtion 12. Maxlength: unlimited -->
    <!--P146 -->
    <!-- Domain name, DHCP oPtion 15. Max length allowed is 64 characters. -->
    <P147></P147>
    <!-- Vendor Class ID, DHCP oPtion 60. Maxlength: unlimited -->
    <P148>GXV</P148>
    <!-- Static IP. IP address -->
    <!--P9 = 192 -->
    <!--P10 = 168 -->
    <!--P11 = 0 -->
    <!--P12 = 160 -->
    <!-- Static IP. Subnet Mask -->
    <!--P13 = 255 -->
    <!--P14 = 255 -->
    <!--P15 = 0 -->
    <!--P16 = 0 -->
    <!-- Static IP. Default Gateway -->
    <!--P17 = 0 -->
    <!--P18 = 0 -->
    <!--P19 = 0 -->
    <!--P20 = 0 -->
    <!-- Static IP. DNS Server 1. Ignore if DHCP or PPPoE is used -->
    <!--P21 = 0 -->
    <!--P22 = 0 -->
    <!--P23 = 0 -->
    <!--P24 = 0 -->
    <!-- Static IP. DNS Server 2. Ignore if DHCP or PPPoE is used -->
    <!--P25 = 0 -->
    <!--P26 = 0 -->
    <!--P27 = 0 -->
    <!--P28 = 0 -->
    <!-- Alternate DNS Server, four field, octet digits -->
    <!--P92 = 0 -->
    <!--P93 = 0 -->
    <!--P94 = 0 -->
    <!--P95 = 0 -->
    <!-- Second Alternate DNS Server, four field, octet digits -->
    <P5026></P5026>
    <P5027></P5027>
    <P5028></P5028>
    <P5029></P5029>
    <!-- Layer 3 QoS for SIP -->
    <P1558>46</P1558>
    <!-- Layer 3 QoS for Audio -->
    <P1559>46</P1559>
    <!-- Layer 3 QoS for Video -->
    <P1560>46</P1560>
    <!-- Layer 2 QoS. 802.1Q/VLAN Tag (VLAN classification for RTP) -->
    <P51>0</P51>
    <!-- Layer 2 QoS. 802.1P Priority value -->
    <!-- Allowed value: 0-7 -->
    <P87>0</P87>
    <!-- PC Port VLAN Tag -->
    <P229></P229>
    <!-- PC Port Priority Value -->
    <P230></P230>
    <!-- 802.1x Mode: 0- 802.1x disabled (Default), 1- EAP/MD5 -->
    <P7901>0</P7901>
    <!-- 802.1x Identity, MaxLength 64 -->
    <!-- P7902 -->
    <!-- MD5 Password, MaxLength 64 -->
    <!-- P7903 -->
    <!-- User-Agent. User-Agent header in HTTP download requests-->
    <!-- MaxLength 64 -->
    <!--P1541 -->
    <!-- Hide network setting for Virtual in LCD menu. 0 - No, 1 - Yes -->
    <P1542>0</P1542>
    <!-- Hide network setting for 3G. 0 - No, 1 - Yes. -->
    <P1543>0</P1543>
    <!-- Hide network setting for Proxy. 0 - No, 1 - Yes. -->
    <P1544>0</P1544>
    <!--  Maintenance/ Wifi Settings -->
    <!-- Wifi Function. 0- Disable, 1- Enable -->
    <!--P7800 = 0 -->
    <!-- Wireless-Mode.  (0-10) -->
    <!--0 - legacy 11b/g mixed -->
    <!--1: legacy 11B onlyP7802 = 0 -->
    <!--2: legacy 11A only -->
    <!--3: legacy 11a/b/g mixed -->
    <!--4: legacy 11G only * -->
    <!--5: 11ABGN mixed * -->
    <!--6: 11N only *  -->
    <!--7: 11GN mixed * -->
    <!--8: 11AN mixed * -->
    <!--9: 11BGN mixed *  (Default) -->
    <!--10: 11AGN mixed * -->
    <!--P7802 = 9 -->
    <!-- Wifi Network TyPe. Infra, Adhoc -->
    <!--P7811 = Infra -->
    <!-- Channel (different oPtions dePends on CountryRegion) -->
    <!-- Default is Auto - 0 ( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 channel). -->
    <!--P7813 = 0 -->
    <!-- ESSID -->
    <!--P7812 = -->
    <!-- Authentication Mode. OPEN, SHARED, WEPAUTO, WPAPSK, WPA2PSK, WPANONE -->
    <!--P7814 = OPEN -->
    <!-- EncryPtion.    AES, TKIP, WEP, NONE. -->
    <!--P7815 = NONE -->
    <!-- WEP Default Key ID. (1 to 4) -->
    <!--P7820 = 1 -->
    <!-- WEP Default Key, MaxLength 64 -->
    <!--P7821 = -->
    <!--P7822 = -->
    <!--P7823 = -->
    <!--P7824 = -->
    <!-- WPAPSK key, MaxLength 64 -->
    <!--P7829 = -->
    <!--  Maintenance/ Time Settings -->
    <!-- NTP Server, MaxLength 32 -->
    <!--P30 = ntP.iPvideotalk.com -->
    <!-- DHCP OPtion 42 override NTP server. 0 - No, 1 - Yes. Default is Yes. -->
    <!-- When set to Yes(1), it will override the configured NTP server. -->
    <P144>1</P144>
    <!-- DHCP OPtion 2 to Override Time Zone setting. 0 - No, 1 - Yes. -->
    <!-- When set to Yes(1), it will override the configured Time Zone setting if available. -->
    <P143>1</P143>
    <!-- Time Zone -->
    <!-- Australia -->
    <!--   Melbourne,Canberra,Sydney EST-10EDT-11,M10.5.0/02:00:00,M3.5.0/03:00:00 -->
    <!--   Perth                     WST-8 -->
    <!--   Brisbane                  EST-10 -->
    <!--   Adelaide                  CST-9:30CDT-10:30,M10.5.0/02:00:00,M3.5.0/03:00:00 -->
    <!--   Darwin                    CST-9:30 -->
    <!--   Hobart                    EST-10EDT-11,M10.1.0/02:00:00,M3.5.0/03:00:00 -->
    <!-- EuroPe -->
    <!--   Amsterdam, Netherlands    CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   Athens, Greece            EET-2EEST-3,M3.5.0/03:00:00,M10.5.0/04:00:00 -->
    <!--   Barcelona, SPain          CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   Berlin, Germany           CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   Brussels, Belgium         CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   BudaPest, Hungary         CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   CoPenhagen, Denmark       CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   Dublin, Ireland           GMT+0IST-1,M3.5.0/01:00:00,M10.5.0/02:00:00  -->
    <!--   Geneva, Switzerland       CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   Helsinki, Finland         EET-2EEST-3,M3.5.0/03:00:00,M10.5.0/04:00:00 -->
    <!--   Kyiv, Ukraine             EET-2EEST,M3.5.0/3,M10.5.0/4 -->
    <!--   Lisbon, Portugal          WET-0WEST-1,M3.5.0/01:00:00,M10.5.0/02:00:00 -->
    <!--   London, Great Britain     GMT+0BST-1,M3.5.0/01:00:00,M10.5.0/02:00:00 -->
    <!--   Madrid, SPain             CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   Oslo, Norway              CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   Paris, France             CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   Prague, Czech RePublic    CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   Roma, Italy               CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   Moscow, Russia            MSK-3MSD,M3.5.0/2,M10.5.0/3 -->
    <!--   St.Petersburg, Russia     MST-3MDT,M3.5.0/2,M10.5.0/3 -->
    <!--   Stockholm, Sweden         CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00 -->
    <!--   Tallinn, Estonia          EET-2EEST-3,M3.5.0/03:00:00,M10.5.0/04:00:00 -->
    <!-- New Zealand -->
    <!--   Auckland, Wellington      NZST-12NZDT-13,M10.1.0/02:00:00,M3.3.0/03:00:00 -->
    <!-- USA & Canada1 -->
    <!--   Hawaii Time               HAW10 -->
    <!--   Alaska Time               AKST9AKDT -->
    <!--   Pacific Time              PST8PDT -->
    <!--   Mountain Time             MST7MDT -->
    <!--   Mountain Time (Arizona)   MST7 -->
    <!--   Central Time              CST6CDT -->
    <!--   Eastern Time              EST5EDT -->
    <!--   Atlantic Time             AST4ADT -->
    <!--   New Brunswick             AST4ADT,M4.1.0/00:01:00,M10.5.0/00:01:00 -->
    <!--   Newfoundland              NST+3:30NDT+2:30,M4.1.0/00:01:00,M10.5.0/00:01:00 -->
    <!-- Asia -->
    <!--   Jakarta                   WIB-7 -->
    <!--   SingaPore                 SGT-8 -->
    <!--   Beijing, TaiPei           TZY-8 -->
    <!--   Ulaanbaatar, Mongolia     ULAT-8ULAST,M3.5.0/2,M9.5.0/2 -->
    <!--   JaPan, Korea, Yakutsk     TZY-9 -->
    <!-- Central and South America -->
    <!--   Brazil, Sao Paulo         BRST+3BRDT+2,M10.3.0,M2.3.0 -->
    <!--   Argentina                 UTC+3 -->
    <!--   Central America           CST+6 -->
    <!-- customize -->
    <!--P64 = EST5EDT -->
    <!-- Enable time zone auto config via IP2Location service. 0 - No, 1 - Yes -->
    <!-- Must be 0 if using P64 to Provision -->
    <!--P1529 = 0 -->
    <!-- Self-Defined Time Zone, MaxLength 32 -->
    <!--P246 = MTZ+6MDT+5,M4.1.0,M11.1.0 -->
    <!-- Time DisPlay Format. 12hr - 0, 24hr - 1 (Default). -->
    <P122>1</P122>
    <!-- Date DisPlay Format. YY-MM-DD - 0, MM-DD-YY - 1 (Default), DD-MM-YY - 2. -->
    <P102>1</P102>
    <!-- Maintenance/ Web/Telnet Access    -->
    <!-- Disable Telnet. 0 - No, 1 - Yes -->
    <P276>0</P276>
    <!-- Web Access Method. 0 - HTTP, 1 - HTTPS -->
    <P900>0</P900>
    <!-- Web Port: HTTP default is 80 and HTTPS default is 443 -->
    <P901>80</P901>

    <!-- Admin Password for web interface, MaxLength 32 -->
    <P2>{$admin_password}</P2>

    <!-- End User Password, MaxLength 32 -->
    <P196>{$user_password}</P196>
   
    <!-- Maintenance/ UPgrade and Provisioning -->
    <!-- Enable Provider Lock. 0 - No, 1 - Yes. -->
    <P9999>0</P9999>
    <!-- Provider Lock Key. A string of uP to 16 bytes. -->
    <P9998>nouse</P9998>
    <!-- Provider Authentication. A string of uP to 16 bytes -->
    <P9997>nouse</P9997>
    <!-- Password for configuration file authentication, MaxLength 30 -->
    <P1></P1>
    <!-- Enable IP2Location auto config service. 0 - No, 1 - Yes. -->
    <P7070>1</P7070>
    <!-- Lock KeyPad UPdate. 0 - No, 1 - Yes -->
    <P88>0</P88>
    <!-- XML Config File Password -->
    <!--P1359 -->
    <!-- HTTP/HTTPS User Name -->
    <!--P1360 -->
    <!-- HTTP/HTTPS Password -->
    <!--P1361 -->
    <!-- UPgrade Via: (0 - TFTP,1 - HTTP and 2 - HTTPS) -->
    <P212>2</P212>
    <!-- Firmware Server Path, MaxLength 128 -->
    <P192>fw.iPvideotalk.com/gs</P192>
    <!-- Config Server Path, MaxLength 128 -->
    <P237>{$domain_name}{$project_path}/app/provision</P237>
    <!-- Firmware File Prefix, MaxLength 128 -->
    <P232></P232>
    <!-- Firmware File Postfix, MaxLength 128 -->
    <P233></P233>
    <!-- Cust Firmware Prefix (GUI customization file Prefix) -->
    <!-- MaxLength 12 -->
    <P1545></P1545>
    <!-- Cust Firmware Postfix (GUI customization file Postfix) -->
    <!-- MaxLength 12 -->
    <P1546></P1546>
    <!-- Config File Prefix, MaxLength 128 -->
    <P234></P234>
    <!-- Config File Postfix, MaxLength 128 -->
    <P235></P235>
    <!-- DHCP OPtion 66 Override server. 0 - No, 1 - Yes. Default is Yes. -->
    <!-- When set to Yes(1), it will override the configured Provision Path and method. -->
    <P145>1</P145>
    <!-- DHCP OPtion 120 Override SIP Server. 0 - No, 1 - Yes. Default is Yes. -->
    <P1411>1</P1411>
    <!-- 3CX Auto Provision. 0 - No, 1 - Yes. Default is No. -->
    <P1414>0</P1414>
    <!-- Automatic UPgrade. 0 - No, 1 - Check every day, 2 - Check every week, 3 - Check at a Period Time. Default is 0. -->
    <P194>0</P194>
    <!-- Automatic PPgrade Check Interval. Unit is in minute, minimum 60 minutes, default is 7 days. -->
    <P193>10080</P193>
    <!-- Hour of the day (0-23) -->
    <P285>1</P285>
    <!-- Day of the week (0-6) -->
    <P286>1</P286>
    <!-- Automatic UPgrade Rule -->
    <!-- Use firmware Pre/Postfix to determine if f/w is required -->
    <!-- 0 = Always Check for New Firmware -->
    <!-- 1 = Check New Firmware only when F/W Pre/suffix changes -->
    <!-- 2 = Always SkiP the Firmware Check -->
    <P238>0</P238>
    <!-- Authenticate Conf File. 0 - No, 1 - Yes -->
    <P240>0</P240>
    <!-- Disable setuP guide. 0 - No, 1 - Yes. -->
    <P1532>0</P1532>
    <!-- Maintenance/ Syslog -->
    <!-- Syslog Server- name of the server, Maxlength 32 charactors) -->
    <!--P207 = log.iPvideotalk.com -->
    <!-- Syslog Level (Default setting is NONE) -->
    <!-- 0 - NONE, 1 - DEBUG, 2 - INFO, 3 - WARNING, 4 - ERROR -->
    <P208>0</P208>
    <!-- Send SIP Log. 0 - No, 1 - Yes -->
    <P1387>0</P1387>
    <!--  Maintenance/ Call Functions -->
    <!-- Set KeyPad As Default Tab(Only When KeyPad is shown) -->
    <!-- Video in-call default menu tab. 1 - KeyPad, 2 - Functions -->
    <!--P1527 = 1 -->
    <!-- Show or hide OPtions Menu Bar. 0 ?Show Minimized OPtions Bar, Default, 1 ?Show OPtions Bar non-mimimized -->
    <P1528>0</P1528>
    <!-- Only hide video layer when Video Off -->
    <!-- Whether to send reINVITE when Performing video-off. 0 - Send reINVITE, 1 - No reINVITE. -->
    <P1531>0</P1531>
    <!--  Maintenance/ Language -->
    <!-- Language Selection: en - English (default), zh - SimPlified CHINESE, zh-tw - Traditional CHINESE,-->
    <!-- de - Deutsch, es - EsPanis, fi - Suomi, fr - Francis,  hu - Magyar, it - Italiano, jP - JAPANESE, kr - KOREAN -->
    <!-- nld - Dutch , no - Norske, Pl - Polish, ru - PYCCKNN, sv - Svenskt, tr - Turkey, cz - cesk?-->
    <!-- da - Dansk, en_gb - English(UK), Pt - Portugur, th - Thai -->
    <!--P1362 = en -->
    <!-- Enable language auto config via IP2Location service. 0 - No, 1 - Yes -->
    <!-- Must be 0 if using P1362 to Provision -->
    <!--P1530 = 0 -->
    <!--  Maintenance/ TR-069 -->
    <!-- ACS URL - (Use a valid URL). -->
    <!-- MaxLength 64 -->
    <!--P4503 = -->
    <!-- ACS Username, MaxLength 64 -->
    <!--P4504 = -->
    <!-- ACS Password, MaxLength 30 -->
    <!--P4505 = -->
    <!-- Periodic Inform Enable. 0 - No (Default), 1 - Yes. -->
    <!--P4506 = 0 -->
    <!-- Periodic Inform Interval (s): -->
    <!--P4507 = 300 -->
    <!-- Connection Request Username, MaxLength 64 -->
    <!--P4511 = -->
    <!-- Connection Request Password, MaxLength 30 -->
    <!--P4512 = -->
    <!-- Connection Request Auth Mode. 0 - No, 1 - Basic, 2 - Digest -->
    <P4519>2</P4519>
    <!-- Connection Request Port. 7547 - Default. -->
    <P4518></P4518>
    <!-- Maintenance/OPenVPN Settings       -->
    <!-- Enable OPenVPN, 0 - No, 1 - Yes -->
    <!--P7050 = 0 -->
    <!-- OPenVPN Server Address, MaxLength 300 -->
    <!--P7051 = -->
    <!-- OPenVPN Server Port, Allowed value: 5-65535 -->
    <!--P7052 = -->
    <!--  Maintenance/ Device Manager -->
    <!-- Headset TX Gain (dB), Allowed value: -6, 0, 6 -->
    <P1301>0</P1301>
    <!-- Headset RX Gain (dB), Allowed value: -6, 0, 6 -->
    <P1302>0</P1302>
    <!-- Handset TX gain, 0 ?0dB, 1 ?-6dB, 2 - 6 dB, 3 - -3dB, 4 ?3dB -->
    <P1464>0</P1464>
    <!-- Camera ExPosure:   Allowed value: 0 - 19 -->
    <P915>12</P915>
    <!-- Camera Color Mode:     0 = Color mode (Default), 1 = Monochrome -->
    <P919>0</P919>
    <!-- Camera White Balance:  0 = auto (Default), 1 = fixed -->
    <P920>0</P920>
    <!-- Camera Lens Correction: 0 = no, 1 = yes (Default) -->
    <P926>1</P926>
    <!-- Flicker Control: 0- auto, 1 - 60Hz, 2 - 50Hz -->
    <P7042>0</P7042>
    <!-- Disable TV out extended area. 0 ?no, 1 ?yes. Default is 0. No web UI item. -->
    <P1550>0</P1550>
    <!-- TV out extended disPlay area refresh rate. Default is 5000ms.-->
    <!--P1551 =  5000 -->
    <!--APPlication Settings     -->
    <!--APPlication Settings/ Phonebook   -->
    <!-- Clear The Old List.  0 - No, 1 - Yes. -->
    <P1435>0</P1435>
    <!-- RePlace DuPlicate Items.  0 - No, 1 - Yes. -->
    <P1436>0</P1436>
    <!-- Download Mode.  0 - Off,  1 - TFTP, 2 - HTTP -->
    <P330>2</P330>
    <!-- Download Server URL. -->
    <P331></P331>
    <!-- Download Interval.  Default is 60 minutes.-->
    <!-- Allowed values: 0 - 720 -->
    <P332>60</P332>
    <!-- APPlication Settings/ Browser Settings -->
    <!-- Start Browser on Boot. 0 - No (default), 1 - Yes -->
    <P950>0</P950>
    <!-- Browser Home Page.  maxlength=64 -->
    <!--P952 = -->
    <!-- ImPort/ExPort file tyPe. 0 - XML, 1 - HTML. -->
    <P1533>0</P1533>
    <!-- ImPort/ExProt clear the old list. 0 - No, 1 - Yes.-->
    <P1534>0</P1534>
    <!-- ImPort/ExPort RePlace DuPlicate items. 0 - No, 1 - Yes.-->
    <P1535>0</P1535>
    <!-- Download file tyPe. 0 - XML, 1 - HTML. -->
    <P1536>0</P1536>
    <!-- Download clear the old list. 0 - No, 1 - Yes. -->
    <P1537>0</P1537>
    <!-- Downlaod RePlace DuPlicate items. 0 - No, 1 - Yes. -->
    <P1538>0</P1538>
    <!-- Download Mode. 0 - OFF, 1 - TFTP, 2 - HTTP -->
    <P1539>0</P1539>
    <!-- Download Server. Server URL. -->
    <P1540></P1540>
    <!--  Virtual BLF/ SPeed Dial -->
    <!-- Key 1 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P323>0</P323>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P301>0</P301>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String -->
    <P302></P302>
    <!-- User ID. Max length allowed is 64 characters.-->
    <!-- String -->
    <P303></P303>
    <!-- Key 2 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P324>0</P324>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <P304>0</P304>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String -->
    <P305></P305>
    <!-- User ID. Max length allowed is 64 characters.-->
    <!-- String -->
    <P306></P306>
    <!-- Key Mode.-->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P325>0</P325>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P307>0</P307>
    <!-- Name. Max length allowed is 32 characters.-->
    <!-- String -->
    <P308></P308>
    <!-- User ID. Max length allowed is 64 characters.-->
    <!-- String -->
    <P309></P309>
    <!-- Key 4 -->
    <!-- Key Mode.-->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P326>0</P326>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P310>0</P310>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String -->
    <P311></P311>
    <!-- User ID. Max length allowed is 64 characters. -->
    <!-- String -->
    <P312></P312>
    <!-- Key 5 -->
    <!-- Key Mode.-->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P327>0</P327>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P313>0</P313>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String -->
    <P314></P314>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P315></P315>
    <!-- Key 6 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P328>0</P328>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P316>0</P316>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String -->
    <P317></P317>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P318></P318>
    <!-- Key 7 -->
    <!-- Key Mode.-->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P329>0</P329>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P319>0</P319>
    <!-- Name. Max length allowed is 32 characters.-->
    <!--String -->
    <P320></P320>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P321></P321>
    <!-- Key 8 -->
    <!-- Key Mode.-->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P353>0</P353>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P354>0</P354>
    <!-- Name. Max length allowed is 32 characters.-->
    <!-- String -->
    <P355></P355>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P356></P356>
    <!-- Key 9 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P357>0</P357>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P358>0</P358>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String -->
    <P359></P359>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P360></P360>
    <!-- Key 10 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P361>0</P361>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P362>0</P362>
    <!-- Name. Max length allowed is 32 characters -->
    <!-- String -->
    <P363></P363>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P364></P364>
    <!-- Key 11 -->
    <!-- Key Mode.-->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P365>0</P365>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3  -->
    <!-- Mandatory -->
    <P366>0</P366>
    <!-- Name. Max length allowed is 32 characters -->
    <!-- String -->
    <P367></P367>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String  -->
    <P368></P368>
    <!-- Key 12 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P369>0</P369>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P370>0</P370>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String -->
    <P371></P371>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String  -->
    <P372></P372>
    <!-- Key 13 -->
    <!-- Key Mode.  -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory   -->
    <P373>0</P373>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3  -->
    <!-- Mandatory -->
    <P374>0</P374>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String -->
    <P375></P375>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P376></P376>
    <!-- Key 14 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P377>0</P377>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory  -->
    <P378>0</P378>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String -->
    <P379></P379>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P380></P380>
    <!-- Key 15  -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P381>0</P381>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P382>0</P382>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String  -->
    <P383></P383>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P384></P384>
    <!-- Key 16 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory  -->
    <P385>0</P385>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P386>0</P386>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String -->
    <P387></P387>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P388></P388>
    <!-- Key 17 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P389>0</P389>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P390>0</P390>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String  -->
    <P391></P391>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P392></P392>
    <!-- Key 18 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P393>0</P393>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P394>0</P394>
    <!-- Name. Max length allowed is 32 characters. -->
    <!-- String -->
    <P395></P395>
    <!-- User ID. Max length allowed is 64 character -->
    <!-- String -->
    <P396></P396>
    <!-- Key 19 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6001>0</P6001>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6201>0</P6201>
    <!-- Name -->
    <!-- String -->
    <P6401></P6401>
    <!-- UserID -->
    <!-- String -->
    <P6601></P6601>
    <!-- Key 20 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6002>0</P6002>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6202>0</P6202>
    <!-- Name -->
    <!-- String -->
    <P6402></P6402>
    <!-- UserID -->
    <!-- String -->
    <P6602></P6602>
    <!-- Key 21 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6003>0</P6003>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6203>0</P6203>
    <!-- Name -->
    <!-- String -->
    <P6403></P6403>
    <!-- UserID -->
    <!-- String -->
    <P6603></P6603>
    <!-- Key 22 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6004>0</P6004>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6204>0</P6204>
    <!-- Name -->
    <!-- String -->
    <P6404></P6404>
    <!-- UserID -->
    <!-- String -->
    <P6604></P6604>
    <!-- Key 23 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6005>0</P6005>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6205>0</P6205>
    <!-- Name -->
    <!-- String -->
    <P6405></P6405>
    <!-- UserID -->
    <!-- String -->
    <P6605></P6605>
    <!-- Key 24 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6006>0</P6006>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6206>0</P6206>
    <!-- Name -->
    <!-- String -->
    <P6406></P6406>
    <!-- UserID -->
    <!-- String -->
    <P6606></P6606>
    <!-- Key 25  -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6007>0</P6007>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6207>0</P6207>
    <!-- Name -->
    <!-- String -->
    <P6407></P6407>
    <!-- UserID -->
    <!-- String -->
    <P6607></P6607>
    <!-- Key 26 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6008>0</P6008>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6208>0</P6208>
    <!-- Name -->
    <!-- String -->
    <P6408></P6408>
    <!-- UserID -->
    <!-- String -->
    <P6608></P6608>
    <!-- Key 27 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6009>0</P6009>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6209>0</P6209>
    <!-- Name -->
    <!-- String -->
    <P6409></P6409>
    <!-- UserID -->
    <!-- String -->
    <P6609></P6609>
    <!-- Key 28 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6010>0</P6010>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6010>0</P6010>
    <!-- Name -->
    <!-- String -->
    <P6410></P6410>
    <!-- UserID -->
    <!-- String -->
    <P6610></P6610>
    <!-- Key 29 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6011>0</P6011>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6211>0</P6211>
    <!-- Name -->
    <!-- String -->
    <P6411></P6411>
    <!-- UserID -->
    <!-- String -->
    <P6611></P6611>
    <!-- Key 30 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6012>0</P6012>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6212>0</P6212>
    <!-- Name -->
    <!-- String -->
    <P6412></P6412>
    <!-- UserID -->
    <!-- String -->
    <P6612></P6612>
    <!-- Key 31 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6013>0</P6013>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6213>0</P6213>
    <!-- Name -->
    <!-- String -->
    <P6413></P6413>
    <!-- UserID -->
    <!-- String -->
    <P6613></P6613>
    <!-- Key 32 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6014>0</P6014>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6214>0</P6214>
    <!-- Name -->
    <!-- String -->
    <P6414></P6414>
    <!-- UserID -->
    <!-- String -->
    <P6614></P6614>
    <!-- Key 33 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6015>0</P6015>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6215>0</P6215>
    <!-- Name -->
    <!-- String -->
    <P6415></P6415>
    <!-- UserID -->
    <!-- String -->
    <P6615></P6615>
    <!-- Key 34 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6016>0</P6016>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6216>0</P6216>
    <!-- Name -->
    <!-- String -->
    <P6416></P6416>
    <!-- UserID -->
    <!-- String -->
    <P6616></P6616>
    <!-- Key 35 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6017>0</P6017>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6217>0</P6217>
    <!-- Name -->
    <!-- String -->
    <P6417></P6417>
    <!-- UserID -->
    <!-- String -->
    <P6617></P6617>
    <!-- Key 36 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6018>0</P6018>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6218>0</P6218>
    <!-- Name -->
    <!-- String -->
    <P6418></P6418>
    <!-- UserID -->
    <!-- String -->
    <P6618></P6618>
    <!-- Key 37 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6019>0</P6019>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6219>0</P6219>
    <!-- Name -->
    <!-- String -->
    <P6419></P6419>
    <!-- UserID -->
    <!-- String -->
    <P6619></P6619>
    <!-- Key 38 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6020>0</P6020>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6220>0</P6220>
    <!-- Name -->
    <!-- String -->
    <P6420></P6420>
    <!-- UserID -->
    <!-- String -->
    <P6620></P6620>
    <!-- Key 39 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6021>0</P6021>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6221>0</P6221>
    <!-- Name -->
    <!-- String -->
    <P6421></P6421>
    <!-- UserID -->
    <!-- String -->
    <P6621></P6621>
    <!-- Key 40 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6022>0</P6022>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6222>0</P6222>
    <!-- Name -->
    <!-- String -->
    <P6422></P6422>
    <!-- UserID -->
    <!-- String -->
    <P6622></P6622>
    <!-- Key 41 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6023>0</P6023>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6223>0</P6223>
    <!-- Name -->
    <!-- String -->
    <P6423></P6423>
    <!-- UserID -->
    <!-- String -->
    <P6623></P6623>
    <!-- Key 42 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6024>0</P6024>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6224>0</P6224>
    <!-- Name -->
    <!-- String -->
    <P6424></P6424>
    <!-- UserID -->
    <!-- String -->
    <P6624></P6624>
    <!-- Key 43 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6025>0</P6025>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6225>0</P6225>
    <!-- Name -->
    <!-- String -->
    <P6425></P6425>
    <!-- UserID -->
    <!-- String -->
    <P6625></P6625>
    <!-- Key 44 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6026>0</P6026>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6226>0</P6226>
    <!-- Name -->
    <!-- String -->
    <P6426></P6426>
    <!-- UserID -->
    <!-- String -->
    <P6626></P6626>
    <!-- Key 45 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6027>0</P6027>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6227>0</P6227>
    <!-- Name -->
    <!-- String -->
    <P6427></P6427>
    <!-- UserID -->
    <!-- String -->
    <P6627></P6627>
    <!-- Key 46 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6028>0</P6028>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6228>0</P6228>
    <!-- Name -->
    <!-- String -->
    <P6428></P6428>
    <!-- UserID -->
    <!-- String -->
    <P6628></P6628>
    <!-- Key 47 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6029>0</P6029>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6229>0</P6229>
    <!-- Name -->
    <!-- String -->
    <P6429></P6429>
    <!-- UserID -->
    <!-- String -->
    <P6629></P6629>
    <!-- Key 48 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6030>0</P6030>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6230>0</P6230>
    <!-- Name -->
    <!-- String -->
    <P6430></P6430>
    <!-- UserID -->
    <!-- String -->
    <P6630></P6630>
    <!-- Key 49 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6031>0</P6031>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6231>0</P6231>
    <!-- Name -->
    <!-- String -->
    <P6431></P6431>
    <!-- UserID -->
    <!-- String -->
    <P6631></P6631>
    <!-- Key 50 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6032>0</P6032>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6232>0</P6232>
    <!-- Name -->
    <!-- String -->
    <P6432></P6432>
    <!-- UserID -->
    <!-- String -->
    <P6632></P6632>
    <!-- Key 51 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6033>0</P6033>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6233>0</P6233>
    <!-- Name -->
    <!-- String -->
    <P6433></P6433>
    <!-- UserID -->
    <!-- String -->
    <P6633></P6633>
    <!-- Key 52 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6034>0</P6034>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6234>0</P6234>
    <!-- Name -->
    <!-- String -->
    <P6434></P6434>
    <!-- UserID -->
    <!-- String -->
    <P6634></P6634>
    <!-- Key 53 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6035>0</P6035>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6235>0</P6235>
    <!-- Name -->
    <!-- String -->
    <P6435></P6435>
    <!-- UserID -->
    <!-- String -->
    <P6635></P6635>
    <!-- Key 54 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6036>0</P6036>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6236>0</P6236>
    <!-- Name -->
    <!-- String -->
    <P6436></P6436>
    <!-- UserID -->
    <!-- String -->
    <P6636></P6636>
    <!-- Key 55 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6037>0</P6037>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6237>0</P6237>
    <!-- Name -->
    <!-- String -->
    <P6437></P6437>
    <!-- UserID -->
    <!-- String -->
    <P6637></P6637>
    <!-- Key 56 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6038>0</P6038>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6238>0</P6238>
    <!-- Name -->
    <!-- String -->
    <P6438></P6438>
    <!-- UserID -->
    <!-- String -->
    <P6638></P6638>
    <!-- Key 57  -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6039>0</P6039>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6239>0</P6239>
    <!-- Name -->
    <!-- String -->
    <P6439></P6439>
    <!-- UserID -->
    <!-- String -->
    <P6639></P6639>
    <!-- Key 58 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6040>0</P6040>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6240>0</P6240>
    <!-- Name -->
    <!-- String -->
    <P6440></P6440>
    <!-- UserID -->
    <!-- String -->
    <P6640></P6640>
    <!-- Key 59 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6041>0</P6041>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6241>0</P6241>
    <!-- Name -->
    <!-- String -->
    <P6441></P6441>
    <!-- UserID -->
    <!-- String -->
    <P6641></P6641>
    <!-- Key 60 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6042>0</P6042>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6242>0</P6242>
    <!-- Name -->
    <!-- String -->
    <P6442></P6442>
    <!-- UserID -->
    <!-- String -->
    <P6642></P6642>
    <!-- Key 61 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6043>0</P6043>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6243>0</P6243>
    <!-- Name -->
    <!-- String -->
    <P6443></P6443>
    <!-- UserID -->
    <!-- String -->
    <P6643></P6643>
    <!-- Key 62 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6044>0</P6044>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6244>0</P6244>
    <!-- Name -->
    <!-- String -->
    <P6444></P6444>
    <!-- UserID -->
    <!-- String -->
    <P6644></P6644>
    <!-- Key 63 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6045>0</P6045>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6245>0</P6245>
    <!-- Name -->
    <!-- String -->
    <P6445></P6445>
    <!-- UserID -->
    <!-- String -->
    <P6645></P6645>
    <!-- Key 64 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6046>0</P6046>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6246>0</P6246>
    <!-- Name -->
    <!-- String -->
    <P6446></P6446>
    <!-- UserID -->
    <!-- String -->
    <P6646></P6646>
    <!-- Key 65 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6047>0</P6047>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6247>0</P6247>
    <!-- Name -->
    <!-- String -->
    <P6447></P6447>
    <!-- UserID -->
    <!-- String -->
    <P6647></P6647>
    <!-- Key 66 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6048>0</P6048>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6248>0</P6248>
    <!-- Name -->
    <!-- String -->
    <P6448></P6448>
    <!-- UserID -->
    <!-- String -->
    <P6648></P6648>
    <!-- Key 67 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6049>0</P6049>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6249>0</P6249>
    <!-- Name -->
    <!-- String -->
    <P6449></P6449>
    <!-- UserID -->
    <!-- String -->
    <P6649></P6649>
    <!-- Key 68 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6050>0</P6050>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6250>0</P6250>
    <!-- Name -->
    <!-- String -->
    <P6450></P6450>
    <!-- UserID -->
    <!-- String -->
    <P6650></P6650>
    <!-- Key 69 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6051>0</P6051>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6251>0</P6251>
    <!-- Name -->
    <!-- String -->
    <P6451></P6451>
    <!-- UserID -->
    <!-- String -->
    <P6651></P6651>
    <!-- Key 70 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6052>0</P6052>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6252>0</P6252>
    <!-- Name -->
    <!-- String -->
    <P6452></P6452>
    <!-- UserID -->
    <!-- String -->
    <P6652></P6652>
    <!-- Key 71 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6053>0</P6053>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3  -->
    <!-- Mandatory -->
    <P6253>0</P6253>
    <!-- Name -->
    <!-- String  -->
    <P6453></P6453>
    <!-- UserID  -->
    <!-- String  -->
    <P6653></P6653>
    <!-- Key 72 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6054>0</P6054>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6254>0</P6254>
    <!-- Name -->
    <!-- String -->
    <P6454></P6454>
    <!-- UserID -->
    <!-- String -->
    <P6654></P6654>
    <!-- Key 73 -->
    <!-- Key Mode.-->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6055>0</P6055>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6255>0</P6255>
    <!-- Name -->
    <!-- String -->
    <P6455></P6455>
    <!-- UserID -->
    <!-- String -->
    <P6655></P6655>
    <!-- Key 74 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6056>0</P6056>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6256>0</P6256>
    <!-- Name -->
    <!-- String -->
    <P6456></P6456>
    <!-- UserID -->
    <!-- String -->
    <P6656></P6656>
    <!-- Key 75 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6057>0</P6057>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6257>0</P6257>
    <!-- Name -->
    <!-- String -->
    <P6457></P6457>
    <!-- UserID -->
    <!-- String -->
    <P6657></P6657>
    <!-- Key 76 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6058>0</P6058>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6258>0</P6258>
    <!-- Name -->
    <!-- String -->
    <P6458></P6458>
    <!-- UserID -->
    <!-- String -->
    <P6658></P6658>
    <!-- Key 77 -->
    <!-- Key Mode.-->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6059>0</P6059>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6259>0</P6259>
    <!-- Name -->
    <!-- String -->
    <P6459></P6459>
    <!-- UserID -->
    <!-- String -->
    <P6659></P6659>
    <!-- Key 78 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6060>0</P6060>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6260>0</P6260>
    <!-- Name -->
    <!-- String -->
    <P6460></P6460>
    <!-- UserID -->
    <!-- String -->
    <P6660></P6660>
    <!-- Key 79 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6061>0</P6061>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6261>0</P6261>
    <!-- Name -->
    <!-- String -->
    <P6461></P6461>
    <!-- UserID -->
    <!-- String -->
    <P6661></P6661>
    <!-- Key 80 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6062>0</P6062>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6262>0</P6262>
    <!-- Name -->
    <!-- String -->
    <P6462></P6462>
    <!-- UserID -->
    <!-- String  -->
    <P6662></P6662>
    <!-- Key 81 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6063>0</P6063>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6263>0</P6263>
    <!-- Name -->
    <!-- String -->
    <P6463></P6463>
    <!-- UserID -->
    <!-- String -->
    <P6663></P6663>
    <!-- Key 82 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6064>0</P6064>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6264>0</P6264>
    <!-- Name -->
    <!-- String -->
    <P6464></P6464>
    <!-- UserID -->
    <!-- String -->
    <P6664></P6664>
    <!-- Key 83 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6664>0</P6664>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6265>0</P6265>
    <!-- Name -->
    <!-- String -->
    <P6465></P6465>
    <!-- UserID -->
    <!-- String -->
    <P6665></P6665>
    <!-- Key 84-->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF-->
    <!-- Mandatory-->
    <P6066>0</P6066>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3-->
    <!-- Mandatory -->
    <P6266>0</P6266>
    <!-- Name-->
    <!-- String -->
    <P6466></P6466>
    <!-- UserID  -->
    <!-- String  -->
    <P6666></P6666>
    <!-- Key 85 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6067>0</P6067>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6267>0</P6267>
    <!-- Name -->
    <!-- String -->
    <P6467></P6467>
    <!-- UserID -->
    <!-- String -->
    <P6667></P6667>
    <!-- Key 86 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6068></P6068>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6268>0</P6268>
    <!-- Name -->
    <!-- String -->
    <P6468></P6468>
    <!-- UserID -->
    <!-- String -->
    <P6668></P6668>
    <!-- Key 87 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6069>0</P6069>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6269>0</P6269>
    <!-- Name -->
    <!-- String -->
    <P6469></P6469>
    <!-- UserID -->
    <!-- String -->
    <P6669></P6669>
    <!-- Key 88 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6070>0</P6070>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6270>0</P6270>
    <!-- Name -->
    <!-- String -->
    <P6470></P6470>
    <!-- UserID -->
    <!-- String -->
    <P6670></P6670>
    <!-- Key 89 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6071>0</P6071>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6271>0</P6271>
    <!-- Name -->
    <!-- String -->
    <P6471></P6471>
    <!-- UserID -->
    <!-- String -->
    <P6671></P6671>
    <!-- Key 90 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6072>0</P6072>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6272>0</P6272>
    <!-- Name -->
    <!-- String -->
    <P6472>0</P6472>
    <!-- UserID -->
    <!-- String -->
    <P6672>0</P6672>
    <!-- Key 91 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6073>0</P6073>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6273>0</P6273>
    <!-- Name -->
    <!-- String -->
    <P6473></P6473>
    <!-- UserID -->
    <!-- String -->
    <P6673></P6673>
    <!-- Key 92 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6074>0</P6074>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6274>0</P6274>
    <!-- Name -->
    <!-- String -->
    <P6474></P6474>
    <!-- UserID -->
    <!-- String -->
    <P6674></P6674>
    <!-- Key 93 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6075>0</P6075>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6275></P6275>
    <!-- Name -->
    <!-- String -->
    <P6475></P6475>
    <!-- UserID -->
    <!-- String -->
    <P6675></P6675>
    <!-- Key 94 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6675>0</P6675>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6276></P6276>
    <!-- Name -->
    <!-- String -->
    <P6476></P6476>
    <!-- UserID -->
    <!-- String -->
    <P6676></P6676>
    <!-- Key 95 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6277>0</P6277>
    <!-- Name -->
    <!-- String -->
    <P6477></P6477>
    <!-- UserID -->
    <!-- String -->
    <P6677></P6677>
    <!-- Key 96 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6078>0</P6078>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6278>0</P6278>
    <!-- Name -->
    <!-- String -->
    <P6478></P6478>
    <!-- UserID -->
    <!-- String -->
    <P6678></P6678>
    <!-- Key 97 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6079>0</P6079>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6279>0</P6279>
    <!-- Name -->
    <!-- String -->
    <P6479></P6479>
    <!-- UserID -->
    <!-- String -->
    <P6679></P6679>
    <!-- Key 98 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6080>0</P6080>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6280>0</P6280>
    <!-- Name -->
    <!-- String -->
    <P6480></P6480>
    <!-- UserID -->
    <!-- String -->
    <P6680></P6680>
    <!-- Key 99 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6081>0</P6081>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory  -->
    <P6281>0</P6281>
    <!-- Name -->
    <!-- String -->
    <P6481></P6481>
    <!-- UserID -->
    <!-- String -->
    <P6681></P6681>
    <!-- Key 100 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6082>0</P6082>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6282>0</P6282>
    <!-- Name -->
    <!-- String -->
    <P6482></P6482>
    <!-- UserID -->
    <!-- String -->
    <P6682></P6682>
    <!-- Key 101  -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6083>0</P6083>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6283>0</P6283>
    <!-- Name -->
    <!-- String -->
    <P6483></P6483>
    <!-- UserID -->
    <!-- String -->
    <P6683></P6683>
    <!-- Key 102 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6084>0</P6084>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6284>0</P6284>
    <!-- Name -->
    <!-- String -->
    <P6484></P6484>
    <!-- UserID -->
    <!-- String -->
    <P6684></P6684>
    <!-- Key 103 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6085></P6085>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6285>0</P6285>
    <!-- Name -->
    <!-- String -->
    <P6485></P6485>
    <!-- UserID -->
    <!-- String -->
    <P6685></P6685>
    <!-- Key 104 -->
    <!-- Key Mode  -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6086>0</P6086>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6286>0</P6286>
    <!-- Name  -->
    <!-- String -->
    <P6486></P6486>
    <!-- UserID  -->
    <!-- String -->
    <P6686></P6686>
    <!-- Key 105 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6087>0</P6087>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6287>0</P6287>
    <!-- Name -->
    <!-- String -->
    <P6487></P6487>
    <!-- UserID -->
    <!-- String -->
    <P6687></P6687>
    <!-- Key 106 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6088>0</P6088>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6288>0</P6288>
    <!-- Name -->
    <!-- String -->
    <P6488></P6488>
    <!-- UserID -->
    <!-- String -->
    <P6688></P6688>
    <!-- Key 107 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6089>0</P6089>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6289>0</P6289>
    <!-- Name -->
    <!-- String -->
    <P6489></P6489>
    <!-- UserID -->
    <!-- String -->
    <P6689></P6689>
    <!-- Key 108 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6090>0</P6090>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6290>0</P6290>
    <!-- Name -->
    <!-- String -->
    <P6490></P6490>
    <!-- UserID -->
    <!-- String -->
    <P6690></P6690>
    <!-- Key 109 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6091>0</P6091>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6291>0</P6291>
    <!-- Name -->
    <!-- String -->
    <P6491></P6491>
    <!-- UserID -->
    <!-- String -->
    <P6691></P6691>
    <!-- Key 110 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6092>0</P6092>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6292>0</P6292>
    <!-- Name -->
    <!-- String -->
    <P6492></P6492>
    <!-- UserID -->
    <!-- String -->
    <P6692></P6692>
    <!-- Key 111 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6093>0</P6093>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6293>0</P6293>
    <!-- Name -->
    <!-- String -->
    <P6493></P6493>
    <!-- UserID -->
    <!-- String -->
    <P6693></P6693>
    <!-- Key 112 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6094>0</P6094>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6294>0</P6294>
    <!-- Name -->
    <!-- String -->
    <P6494></P6494>
    <!-- UserID -->
    <!-- String -->
    <P6694></P6694>
    <!-- Key 113 -->
    <!-- Key Mode.-->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6095>0</P6095>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6095>0</P6095>
    <!-- Name -->
    <!-- String -->
    <P6495></P6495>
    <!-- UserID -->
    <!-- String -->
    <P6695></P6695>
    <!-- Key 114 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6096>0</P6096>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6296>0</P6296>
    <!-- Name -->
    <!-- String -->
    <P6496></P6496>
    <!-- UserID -->
    <!-- String -->
    <P6696></P6696>
    <!-- Key 115 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6097>0</P6097>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6297>0</P6297>
    <!-- Name -->
    <!-- String -->
    <P6497></P6497>
    <!-- UserID -->
    <!-- String -->
    <P6697></P6697>
    <!-- Key 116 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6098>0</P6098>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6298>0</P6298>
    <!-- Name -->
    <!-- String -->
    <P6498></P6498>
    <!-- UserID -->
    <!-- String -->
    <P6698></P6698>
    <!-- Key 117 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6099>0</P6099>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6299>0</P6299>
    <!-- Name -->
    <!-- String -->
    <P6499></P6499>
    <!-- UserID -->
    <!-- String -->
    <P6699></P6699>
    <!-- Key 118 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6699>0</P6699>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6300>0</P6300>
    <!-- Name -->
    <!-- String -->
    <P6500></P6500>
    <!-- UserID -->
    <!-- String -->
    <P6700></P6700>
    <!-- Key 119 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6101>0</P6101>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6301>0</P6301>
    <!-- Name -->
    <!-- String -->
    <P6501></P6501>
    <!-- UserID -->
    <!-- String -->
    <P6701></P6701>
    <!-- Key 120 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6102>0</P6102>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6302>0</P6302>
    <!-- Name -->
    <!-- String -->
    <P6502></P6502>
    <!-- UserID -->
    <!-- String -->
    <P6702></P6702>
    <!-- Key 121 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6103>0</P6103>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6303>0</P6303>
    <!-- Name -->
    <!-- String -->
    <P6503></P6503>
    <!-- UserID -->
    <!-- String -->
    <P6703></P6703>
    <!-- Key 122 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6104>0</P6104>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6304>0</P6304>
    <!-- Name -->
    <!-- String -->
    <P6504></P6504>
    <!-- UserID -->
    <!-- String -->
    <P6704></P6704>
    <!-- Key 123 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6105>0</P6105>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6305>0</P6305>
    <!-- Name -->
    <!-- String -->
    <P6505></P6505>
    <!-- UserID -->
    <!-- String -->
    <P6705></P6705>
    <!-- Key 124 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6106>0</P6106>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6306>0</P6306>
    <!-- Name -->
    <!-- String -->
    <P6506></P6506>
    <!-- UserID -->
    <!-- String -->
    <P6706></P6706>
    <!-- Key 125 -->
    <!-- Key Mode -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6107>0</P6107>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6307>0</P6307>
    <!-- Name -->
    <!-- String -->
    <P6507></P6507>
    <!-- UserID -->
    <!-- String -->
    <P6707></P6707>
    <!-- Key 126 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6108>0</P6108>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6308>0</P6308>
    <!-- Name -->
    <!-- String -->
    <P6508></P6508>
    <!-- UserID -->
    <!-- String -->
    <P6708></P6708>
    <!-- Key 127 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6109>0</P6109>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6309>0</P6309>
    <!-- Name -->
    <!-- String -->
    <P6509></P6509>
    <!-- UserID -->
    <!-- String -->
    <P6709></P6709>
    <!-- Key 128 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF -->
    <!-- Mandatory -->
    <P6110>0</P6110>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6310>0</P6310>
    <!-- Name -->
    <!-- String -->
    <P6510></P6510>
    <!-- UserID -->
    <!-- String -->
    <P6710></P6710>
    <!-- Key 129 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6111>0</P6111>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6311>0</P6311>
    <!-- Name -->
    <!-- String -->
    <P6511></P6511>
    <!-- UserID -->
    <!-- String -->
    <P6711></P6711>
    <!-- Key 130 -->
    <!-- Key Mode. -->
    <!-- 0 - SPeed Dial, 1 - BLF  -->
    <!-- Mandatory -->
    <P6112>0</P6112>
    <!-- Account. 0 - Account 1, 1 - Account 2, 2 - Account 3 -->
    <!-- Mandatory -->
    <P6312>0</P6312>
    <!-- Name -->
    <!-- String -->
    <P6512></P6512>
    <!-- UserID -->
    <!-- String -->
    <P6712></P6712>
  </config>
</gs_provision>
*/

?>