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
<?xml version="1.0" encoding="UTF-8"?>
<config xmlns="http://www.linphone.org/xsds/lpconfig.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.linphone.org/xsds/lpconfig.xsd lpconfig.xsd">
  <section name="net">
    <entry name="download_bw">380</entry>
    <entry name="upload_bw">380</entry>
    <entry name="firewall_policy">0</entry>
    <entry name="mtu">1300</entry>
  </section>
  <section name="sip">
    <entry name="sip_port">5060</entry>
    <entry name="sip_random_port">1</entry>
    <entry name="guess_hostname">1</entry>
    <entry name="contact">sip:unknown@unknown-host</entry>
    <entry name="inc_timeout">15</entry>
    <entry name="use_info">0</entry>
    <entry name="use_ipv6">0</entry>
    <entry name="register_only_when_network_is_up">1</entry>
    <entry name="default_proxy">0</entry>
    <entry name="auto_net_state_mon">0</entry>
    <entry name="keepalive_period">30000</entry>
    <entry name="auto_answer_replacing_calls">1</entry>
    <entry name="media_encryption_mandatory">0</entry>
    <entry name="ping_with_options">0</entry>
  </section>
  <section name="rtp">
    <entry name="audio_rtp_port">7076</entry>
    <entry name="video_rtp_port">9078</entry>
    <entry name="audio_jitt_comp">60</entry>
    <entry name="video_jitt_comp">60</entry>
    <entry name="nortp_timeout">30</entry>
  </section>
  <section name="sound">
    <entry name="remote_ring">/data/data/org.linphone/files/ringback.wav</entry>
    <entry name="local_ring">/data/data/org.linphone/files/oldphone_mono.wav</entry>
    <entry name="dtmf_player_amp">0.1</entry>
    <entry name="ec_tail_len">300</entry>
    <entry name="ec_frame_size">200</entry>
  </section>
  <section name="video">
    <entry name="size">qvga</entry>
  </section>
  <section name="misc">
    <entry name="max_calls">10</entry>
  </section>
  <section name="proxy_0">
    <entry name="reg_proxy">sip:{$proxy}</entry>
    <entry name="reg_route">sip:</entry>
    <entry name="reg_identity">sip:{$user.name}@{$proxy}</entry>
    <entry name="reg_expires">3600</entry>
    <entry name="reg_sendregister">1</entry>
    <entry name="publish">0</entry>
    <entry name="dial_escape_plus">0</entry>
  </section>
  <section name="auth_info_0">
    <entry name="username">{$user.name}</entry>
    <entry name="userid">{$user.name}</entry>
    <entry name="passwd">{$user.secret}</entry>
    <entry name="realm">asterisk</entry>
  </section>
</config>
*/

?>