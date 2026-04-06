var AlertUtil = {
	alertMsg: function (msg) {
		alert(msg);
	},
	confirm: function (msg) {
		return confirm(msg);
	}
};

var WlanPara = "";

var ProgressTime = {
	REBOOT: 120,
	FIND_AP: 15,
	UPDATE_PARTIAL: 150,
	UPLOAD_FILE: 3,
	SEARCH_PLMN: 120,
	UPGRADE_CHECK: 60,
	REMOTE_UPGRADE: 240
};

var seniorHide = {
	web_page_hide_set_0: 0,
	web_page_hide_set_1: 1,
	web_page_hide_set_2: 2,
	web_page_hide_set_3: 3,
	web_page_hide_set_4: 4,
};

var RequestCmd = {
	SYS_INFO: 0,
	WIRELESS_CONFIG: 2,
	NETWORK_CONFIG: 3,
	USER_INFO: 4,
	SYS_UPDATE: 5,
	SYS_REBOOT: 6,
	FIREWALL: 10,

	SET_DATETIME: 11,
	SMS_INFO: 12,
	SMS_SEND: 13,
	SMS_DELETE: 14,
	SMS_DELETE_ALL: 15,
	SMS_SETTING: 16,

	SYS_LOG: 17,
	FLOW_INFO: 18,
	MODULE_LOG: 19,

	APPLY_FILTER: 20,
	PORT_FILTER: 21,
	IP_FILTER: 22,
	MAC_FILTER: 23,
	IP_MAC_BINDING: 24,
	SPEED_LIMIT: 25,
	URL_FILTER: 26,
	OTHER_FILTER: 27,
	DEFAULT_FILTER: 28,
	URL_DEFAULT_FILTER: 29,
	MAC_DEFAULT_FILTER: 30,
	FIRWALL_ACL_FILTER: 31,
	IP_PORT_FILTER: 32,
	FIRWALL_UPNP: 33,
	DEVICE_VERSION_INFO: 43,
	LTE_AT: 45,
	NET_CONNECT: 48,
	NET_DISCONNECT: 49,
	GET_HTML: 50,
	MODEM_CMD: 51,

	INIT_PAGE: 80,
	GET_LTE_STATUS: 82,
	ARP_BINDING: 83,

	CHANGE_LANGUAGE: 97,
	CHANGE_USERNAME: 98,
	REBOOT: 99,
	LOGIN: 100,
	LOGOUT: 101,
	CHANGE_PASSWD: 102,
	FIND_AP: 103,
	GET_DEVICE_NAME: 104,
	UPDATE_PARTIAL: 106,
	RESTORE_DEFAULT: 112,

	GET_SYS_STATUS: 113,
	GET_PLMN_NUMBERS: 114,
	STATIC_LEASE: 115,
	SEARCH_PLMN: 116,
	IPV6_CONFIG: 118,
	GET_SMS_STATUS_REPORT: 125,
	SET_SMS_STATUS_REPORT: 126,

	MULTI_APN_INFO: 130,
	IMSI_PREFIX_LIST: 131,
	WPS_CONFIG: 132,
	ROUTER_INFO: 133,
	QUERY_SIM_STATUS: 134,

	GET_SUPPORT_BANDS: 157,
	LOCK_PHY_CELL: 160,
	LOCK_BAND: 161,
	ROUTER_TABLE: 164,
	TR069_REG: 166,
	PPTP_VPN: 167,
	NETWORK_TOOLS: 168,
	DDNS: 169,
	WRITE_TIME: 170,
	NETWORK_SERVICE: 172,
	GRE_VPN: 135,
	DNS_CONFIG: 175,
	CONFIG_EXPORT: 180,
	PPPOE_LOG: 183,
	CONFIG_UPDATE: 184,
	ONLINE_UPGRADE_AUTO: 196,
	REMOTE_UPGRADE: 198,
	CONFIG_LOADER: 199,
	UPNP: 202,
	FLOW_MONITORING: 203,
	GET_FILE_DATA: 204,
	SYS_INFO_NETWORK: 205,
	WAN_INFO: 206,
	DEVICE_INFO: 207,
	LAN_INFO: 208,
	WIFI_INFO: 209,
	WIFI5G_INFO: 210,
	WIRELESS5G_CONFIG: 211,
	TR069_CONFIG: 212,
	APN_CONFIG: 213,
	GET_DMZ: 214,
	FW_UPNP: 215,
	STATIC_ARP_BINDING: 216,
	ACL_FILTER: 217,
	NETWORKSET_MODE: 218,
	LOCK_PLMN: 219,
	DATA_ROAMING: 220,
	DDNS_DATA: 221,
	AUTO_DIAL: 222,
	DHCPCLIENT_INFO: 223,
	WIFI24G_LIST_INFO: 224,
	WIFI5G_LIST_INFO: 225,
	FLIGHT_MODE_INFO: 226,
	DATA_SWITCH: 227,
	SCCAN_PLMN: 228,
	INPUT_8198D_LOGIN: 229,
	WIRELESS_ADVANCE: 230,
	WIRELESS5G_ADVANCE: 231,
	GET_NEXT_LOGIN_TIME: 232,
	RESET_LOGIN_TIME: 233,
	SYS_SERVICE_SET: 234,
	DISPLAY_SOLUTION_MODE: 235,
	MODEM_LOG_SWITCH: 236,
	ADB_SWITCH: 237,
	DETECTION_VERSION_INFO: 238,
	UPGRADE_IMMEDIATELY: 239,
	SYS_AUTO_UPGRADE: 240,
	EXPORT_LOG: 241,
	WLAN_5G_TPC: 242,
	WPS_PIN_CODE: 243,
	OPEN_RANDOM_PIN: 244,
	REMOTE_PACKET_CAPTURE: 245,
	CHANGE_CARD_TYPE: 246,
	GET_ESIM_INFO: 247,
	APN_INFO_PROCESS: 248,
	RESET_ESIM_INFO: 249,
	DOWNLOAD_ESIM_INFO: 250,
	IP_PASSTHROUGH: 251,
	ONENET_SETTING: 252,
	L2TP_SETTING: 253,
	SLICE_CONIFIG: 254,
	SFP_IPA_SETTING: 255,
	NETWORKSET_MODE_MT2731: 256,
	DM_SETTING: 257,
	SET_ARP_AGING: 258,
	PPTP_SETTING: 259,
	GRE_SETTING: 260,
	ESIM_URL_SETTING: 261,
	COMMLOG_BACKUP_TIME: 262,
	TIME_TO_RESTART: 263,
	LTE_CALIBRATION: 266,
	NR_CALIBRATION: 267,
	TR069_LOG_SWITCH: 268,
	SET_HASH: 269,
	SEND_AT: 270,
	TELECOM_DM: 271,
	VPN_CONFIG: 272,
	GET_ENDC_INFO: 273,
	GET_MOUNT_INFO: 274,
	DDOS_PROTECTION: 275,
	NETWORKMODE_SWITCH: 277,
	WIRELESS_MACFILTER: 278,
	L2TPV3_CONFIG: 279,
	IPSEC_CONFIG: 281,
	GET_NEIGHBOR_INFO: 282,
	GET_SIP_CONFIG: 283,
	SIP_ADVANCED_SETTING: 284,
	WAN_WLAN_MODE: 285,
	CELL_PUNISHMENT: 286,
	UE_CONFIG: 287,
	RESCAN_NETWORK: 288,
	MUTIL_NETWORK_CONFIG: 289,
	MUTIL_VLAN_CONFIG: 290,
	MULTI_WAN_INFO: 291,

	NR_RSRP_THRESHOLD: 293,
	VOICE_ADVANCE_CONFIG: 294,
	VOICE_BASIC_CONFIG: 295,
	VOLTE_CONFIG: 296,
	VOIP_ADVANCED_CONFIG: 297,
	VOIP_CALL_CIPHER: 298,
	MQTT_CONFIG: 299,

	BROADBAND_SETTING: 302,
	MESH_SETTING: 314,//组网设置
	NETWORK_TOPOLOPY: 315,//组网拓扑图
	SYNC_CLIENT_TIME: 321,
	LOG_INFO: 322,
	SET_WPS_SUCCESS_FLAG: 325,
	UNORMAL_REBOOT_SWITCH: 328,
	VXLAN_SETTING: 332,
	FW_UPNP_STATUS: 333,
	REMOTE_WEBPORT_SETTING: 334,
	IPV6_REMOTElOGIN_CONTROL: 335,
	WAN_LINK_DETECT_SETTING: 336,
	TRAFFIC_LIMIT_SETTING: 337,
	LINKDM_SETTING: 339,
	UNLOCK_SIM: 340,
	PCI_LOCK_ENABLE: 341,
	PCI_SCAN: 342,
	SNMP_SETTING: 344,
	FW_ACCESS_CONTROL_SIMPLE: 345,
	USSD_SEND:350,
	DST_SETTING: 351,
  MULTI_WAN_SETTING: 496, //有线多 WAN 设置
  MULTI_WIRED_WAN_INFO: 497, //有线多 WAN 信息
	GETGLOBESTATUS: 1003, //全局状态

	//工业设置相关命令
	DIDO_SETTING: 353,
	SET_PHONE_BOOK:360,
	GET_PHONE_BOOK:361,
	DEL_PHONE_BOOK:362,
	CHANGE_ANTENNA_STATUS: 363, //天线状态参数
	EXPORT_HWSECURITY_LOG:366,//华为安全红线日志导出

	FW_SWITCH_SETTING:367,
	SLEEP_SETTINGS: 371,
	CONTROLS_WARM:372,
	SIM_UNLOCK_RESET: 374, //  SIM Unlock Reset
	NFC_SETTING: 376, //NFC
	LIGHTS_OUT_SETTING:378,//智能熄灯
	INDUSTRY_NETWORK_SET:379,//网关应用配置
	MODBUS_SLAVE_SET:380,//从站设置
	MODBUS_SLAVE_MODULE_SET:381,//从站采集数据设置
  MODBUS_SLAVE_SERIAL_DATA_DEBUG: 387,//MODBUS 调试命令
  GET_L2TPV3_STATUS: 398, //获取 L2TPV3 配置状态
	GET_SYSTEM_PORT : 400,//获取系统占用端口

	PARENT_MODEL:391,
	PARENTAL_CONTROL_SPEED:382,
	PARENTAL_CONTROL_URL:383,
	PARENTAL_CONTROL_TIME:385,

	//---  以下指定是工业设置暂用命令号，晚一步调整为实际命令号   ---------
	SERIAL_SETTING:388,
	MQTT_SETTING:403,
	//   SERIAL_FETCH_DATA:403,
	SERIAL_DATA_OPER:404,

	TRAFFIC_SETTING:405,
	TRAFFIC_INTERFACE_LIST:406,
	TRAFFIC_DAY_STAT:407,
	TRAFFIC_HOUR_STAT:408,
	//---  end:工业设置暂用命令号，晚一步调整为实际命令号   ---------
	GET_STATUS_BAR: 394,
	GET_DASHBOARD_INDEX:401,
	SYS_SSH_SET: 409,
	WIRELESS_POWER:411,
	WIFI_INIT_STATUS: 417,
	WCDMA_CALIBRATION:421,
	VPN_ONLY_ONE:425,
	SIP_ALG: 426,
  MAIN_APN_MOVE_MULTI_APN: 437,//将主 APN 参数平移到辅 APN 上
	MULTI_IP_PASSTHROUGH: 458,
	PORTAL_AUTHENTICATION: 468,
	FOTA_SETTINGS_NEW: 480,
	TR369_CONFIG: 482,
	DEVICE_SELF_CHECK: 484,
	WIRELESS6G_CONFIG: 490,
  WIRELESS6G_ADVANCE: 491,
  RESET_FIRST_LOGIN_FLAG: 499,
  	TRUSTED_IP_SETTING: 502,
  	WIFI_SCHEDULE_SETTING: 503, // WIFI 定时设置
	GAME_TRAFFIC_ACCELERATION: 506, //游戏流量加速
	WAN_PON_MODE: 531, // 光纤网络模式
	GET_PON_INFO: 532, // PON 信息
	PON_WAN_INFO: 534, // PON WAN 连接信息
	PPPOE_L2TP_SETTING: 535, // PPPoE_L2TP
	ESIM_RT_OPERATE: 555, // 红茶移动esim卡相关操作
  PON_UNIVERSAL_BROADBAND_SETTING: 560, 
  MLO_CONFIG: 564,
  ALG_SETTING: 504, // ALG 配置
	L2TP_STATIC_IP: 538, //L2TP 静态 IP
	WIFI_GEOLOCATION: 576, // 使用API获取定位信息
  SYS_MONITOR_AUTO_REBOOT: 580, //AE0001定制
  DEVICELISTINFO: 1000,
  GETWIFIINGO: 1006,
  PON_WAN_LINK_INFO: 1012,
	STATUS_CHART_INFO: 1018, //状态图表信息
	MSG_PUSH_SETTING: 22001, //消息推送设置
};

var RENOOTTYPE = {
	NORMAL_REBOOT: 1,
	CONFIG_CHANGE: 2,
	RESTORE_SETTING: 3,
	RESTORE_REBOOT_CANCEL: 4,
	UPDATE_REBOOT: 5
};

var Url = {
	LOGIN: '/login.html',
	INDEX: '/index.html',
	PASSWD: '/html/changePasswd.html',
	DEFAULT_CGI: '/cgi-bin/http.cgi'
	// DEFAULT_CGI: 'http://192.168.0.1/cgi-bin/http.cgi'
	//DEFAULT_CGI: 'xml_action.cgi?method=set&module=duster&file=http'
};

var MenuItem = {
	DASHBOARD_INFO:{cmd: RequestCmd.GET_DASHBOARD_INDEX, url: "html/dashboard/dashboardIndex.html"},
	SYS_INFO: {
		cmd: RequestCmd.SYS_INFO,
		url: "html/info/sysInfo.html"
	},
	WAN_INFO: {
		cmd: RequestCmd.WAN_INFO,
		url: "html/info/wan_index.html"
	},
	DHCP_INFO: {
		cmd: RequestCmd.DHCP_INFO,
		url: "html/info/lan_index.html"
	},
	WIFI24G_INFO: {
		cmd: RequestCmd.WIFI_INFO,
		url: "html/info/wifi24g_index.html"
	},
	WIFI5G_INFO: {
		cmd: RequestCmd.WIFI_INFO,
		url: "html/info/wifi5g_index.html"
	},
	WIFI6G_INFO: {
		cmd: RequestCmd.WIFI_INFO,
		url: "html/info/wifi6g_index.html"
	},
	DEVICE_INFO: {
		cmd: RequestCmd.SYS_INFO,
		url: "html/info/deviceInfo.html"
	},
	CALIBRATION_INFO: {
		cmd: RequestCmd.LTE_CALIBRATION,
		url: "html/info/calibrationInfo.html"
	},
	STATUSCHART_INFO: {
		cmd: RequestCmd.STATUS_CHART_INFO,
		url: "html/info/statusChartInfo.html"
	},
	TRAFFIC_SETTING: {
		cmd: RequestCmd.TRAFFIC_LIMIT_SETTING,
		url: "html/config/traffic_settingIndex.html"
	},
	WIRELESS_POWER:{
		cmd: RequestCmd.WIRELESS_POWER,
		url: "html/config/wlanPowerIndex.html"
	},
	WIRELESS_CONFIG: {
		cmd: RequestCmd.WIRELESS_CONFIG,
		url: "html/config/wlan24gIndex.html"
	},
	WIRELESS_ADVANCE: {
		cmd: RequestCmd.WIRELESS_ADVANCE,
		url: "html/config/wlan24gAdvanceIndex.html"
	},
	WIRELESS5G_CONFIG: {
		cmd: RequestCmd.WIRELESS5G_CONFIG,
		url: "html/config/wlan5gIndex.html"
	},
	WIRELESS5G_ADVANCE: {
		cmd: RequestCmd.WIRELESS5G_ADVANCE,
		url: "html/config/wlan5gAdvanceIndex.html"
	},
	WIRELESS6G_CONFIG: {
		cmd: RequestCmd.WIRELESS6G_CONFIG,
		url: "html/config/wlan6gIndex.html"
	},
	WIRELESS6G_ADVANCE: {
		cmd: RequestCmd.WIRELESS6G_ADVANCE,
		url: "html/config/wlan6gAdvanceIndex.html"
	},
  MLO_CONFIG: {
    cmd: RequestCmd.MLO_CONFIG,
    url: "html/config/mloIndex.html"
  },
	WPS_CONFIG: {
		cmd: RequestCmd.WPS_CONFIG,
		url: 'html/config/wirelessWpsSettingIndex.html'
	},
	WIRELESS_MACFILTER: {
		cmd: RequestCmd.WIRELESS_MACFILTER,
		url: 'html/config/wifiListIndex.html'
	},
	NFC_SETTING: {
		cmd: RequestCmd.NFC_SETTING,
		url: 'html/config/nfcIndex.html'
	},
	NETWORK_CONFIG: {
		cmd: RequestCmd.NETWORK_CONFIG,
		url: "html/config/dhcpIndex.html"
	},
	VLAN_CONFIG: {
		cmd: RequestCmd.VLAN_CONFIG,
		url: "html/config/vlanIndex.html"
	},
	ROUTER_TABLE: {
		cmd: RequestCmd.ROUTER_TABLE,
		url: "html/advance/routeIndex.html"
	},
	STATIC_IP:{
		cmd: RequestCmd.IP_MAC_BINDING,
		url: "html/advance/staticIPIndex.html"
	},
	CONTROLS_WARM:{
		cmd: RequestCmd.CONTROLS_WARM,
		url: "html/config/controlsWarmIndex.html"
	},
	IP_PASSTHROUGH: {
		cmd: RequestCmd.IP_PASSTHROUGH,
		url: "html/advance/ipPassIndex.html"
	},
	USSD_SET:{
		cmd: RequestCmd.USSD_SET,
		url: "html/manage/ussdIndex.html"
	},
	APN_CONFIG: {
		cmd: RequestCmd.APN_CONFIG,
		url: "html/config/apnConfigIndex.html"
	},
	PIN_CONFIG: {
		cmd: RequestCmd.WAN_INFO,
		url: "html/advance/pinSetIndex.html"
	},
	ESIM_MANAGE: {
		cmd: RequestCmd.WAN_INFO,
		url: "html/advance/esimIndex.html"
	},
	DISPLAY_SOLUTION_MODE: {
		cmd: RequestCmd.DISPLAY_SOLUTION_MODE,
		url: "html/advance/displaySolutionModeIndex.html"
	},
	SLICE_CONIFIG: {
		cmd: RequestCmd.SLICE_CONIFIG,
		url: "html/advance/sliceConfigurationIndex.html"
	},
	CELL_PUNISHMENT: {
		cmd: RequestCmd.CELL_PUNISHMENT,
		url: "html/advance/cellPunishmentIndex.html"
	},
	UE_CONFIG: {
		cmd: RequestCmd.UE_CONFIG,
		url: "html/advance/ueConfigIndex.html"
	},
	NETWORK_SET: {
		cmd: RequestCmd.WAN_INFO,
		url: "html/advance/networkSetIndex.html"
	},
	IPV6_CONFIG: {
		cmd: RequestCmd.IPV6_CONFIG,
		url: "html/config/ipv6Config.html"
	},
	NETWORK_SERVICE: {
		cmd: RequestCmd.NETWORK_SERVICE,
		url: "html/config/networkServiceConfig.html"
	},
	GRE_VPN: {
		cmd: RequestCmd.GRE_VPN,
		url: "html/config/greVpn.html"
	},
	DDNS_CONFIG: {
		cmd: RequestCmd.NETWORK_SERVICE,
		url: "html/ddns/ddnsIndex.html"
	},
	PPTP_VPN: {
		cmd: RequestCmd.PPTP_VPN,
		url: "html/config/pptpVpn.html"
	},
	VOICE_CONFIG: {
		cmd: RequestCmd.VOICE_ADVANCE_CONFIG,
		url: "html/voice/voiceIndex.html"
	},
	SIP_CONFIG: {
		cmd: RequestCmd.GET_SIP_CONFIG,
		url: "html/config/voiceSettingIndex.html"
	},
	SPEED_TEST: {
		cmd: RequestCmd.SPEED_TEST,
		url: "html/config/speedTest.html"
	},

	TR069_SETTING: {
		cmd: RequestCmd.TR069_CONFIG,
		url: "html/advance/tr069Index.html"
	},

	TR369_SETTING: {
		cmd: RequestCmd.TR369_CONFIG,
		url: "html/advance/tr369Index.html"
	},
	PORTAL_SETTING: {
		cmd: RequestCmd.PORTAL_AUTHENTICATION,
		url: "html/advance/portalSettingIndex.html"
	},
	SLEEP_SETTINGS: {
		cmd: RequestCmd.SLEEP_SETTINGS,
		url: "html/advance/autoDormant.html"
	},
	SNMP_SETTING: { cmd: RequestCmd.SNMP_SETTING, url: "html/advance/snmpIndex.html" },

	VPN_SETTING: {
		cmd: RequestCmd.L2TP_SETTING,
		url: "html/advance/vpnIndex.html"
	},
	ONENET_SETTING: {
		cmd: RequestCmd.ONENET_SETTING,
		url: "html/advance/onenetIndex.html"
	},

	MESH: {
		cmd: RequestCmd.MESH_SETTING,
		url: "html/manage/meshSettingIndex.html"
	},

	CHANGE_ANTENNA_STATUS: {
		cmd: RequestCmd.MESH_SETTING,
		url: "html/sys/antennaChange.html"
	},

  PON_UNIVERSAL_BROADBAND_SETTING: {
    cmd: RequestCmd.PON_UNIVERSAL_BROADBAND_SETTING,
    url: "html/sys/broadbandSetting.html"
  },

	ALG_SETTING: {
		cmd: RequestCmd.ALG_SETTING,
    url: "html/config/algSetting.html"
	},

  L2TP_STATIC_IP: {
    cmd: RequestCmd.L2TP_STATIC_IP,
    url: "html/config/l2tpStaticIp.html"
  },

  MSG_PUSH_SETTING: {
    cmd: RequestCmd.MSG_PUSH_SETTING,
    url: "html/config/msgPushSetting.html"
  },

	ADVANCED_CONFIG: {
		cmd: RequestCmd.DDNS_DATA,
		url: "html/advance/advancedConfig.html"
	},

	UNLOCK_SIM: {
		cmd: RequestCmd.UNLOCK_SIM,
		url: "html/advance/unlockIndex.html"
	},
	LTE_LOCK_FREQUENCY: {
		cmd: RequestCmd.LTE_AT,
		url: "html/config/lteLockFrequencyConfig.html"
	},
	LTE_LOCK_FREQUENCY_P500: {
		cmd: RequestCmd.LTE_AT,
		url: "html/config/lteLockFrequencyConfigP500.html"
	},
	LTE_LOCK_FREQUENCY_SIM5360: {
		cmd: RequestCmd.LTE_AT,
		url: "html/config/lteLockFrequencyConfigSim5360.html"
	},
	LTE_LOCK_FREQUENCY_ZTE: {
		cmd: RequestCmd.LTE_AT,
		url: "html/config/lteLockFrequencyConfigZTE.html"
	},
	LTE_AT: {
		cmd: RequestCmd.LTE_AT,
		url: "html/config/lteATConfig.html"
	},


	// FE_DEFAULT: { cmd: RequestCmd.DEFAULT_FILTER, url: "html/firewall/firewall.html" },
	FW_RULE: {
		cmd: RequestCmd.PORT_FILTER,
		url: "html/firewall/ipFilterIndex.html"
	},
	URL_FILTER: {
		cmd: RequestCmd.URL_FILTER,
		url: "html/firewall/urlFilterIndex.html"
	},
	FW_MAC_FILTER: {
		cmd: RequestCmd.MAC_FILTER,
		url: "html/firewall/macIndex.html"
	},
	//FW_MAC_FILTER: { cmd: RequestCmd.MAC_FILTER, url: "html/firewall/firewall.html" },
	FW_IP_MAC_BINDING: {
		cmd: RequestCmd.IP_MAC_BINDING,
		url: "html/firewall/ipMacBindingIndex.html"
	},
	FW_URL_FILTER: {
		cmd: RequestCmd.URL_FILTER,
		url: "html/firewall/urlFilterIndex.html"
	},
	FW_PORT_FORWARD: {
		cmd: RequestCmd.OTHER_FILTER,
		url: "html/firewall/portForwardIndex.html"
	},
	FW_ACL_FILTER: {
		cmd: RequestCmd.ACL_FILTER,
		url: "html/firewall/aclFilterIndex.html"
	},
	FW_SPEED_LIMIT: {
		cmd: RequestCmd.SPEED_LIMIT,
		url: "html/firewall/speedLimitIndex.html"
	},
	STATIC_ARP_BINDING: {
		cmd: RequestCmd.STATIC_ARP_BINDING,
		url: "html/firewall/staticArpBindingIndex.html"
	},
	FW_GAME_TRAFFIC_ACCELERATION: {
		cmd: RequestCmd.GAME_TRAFFIC_ACCELERATION,
		url: "html/firewall/gameTrafficAccelerationIndex.html"
	},
	FW_UPNP: {
		cmd: RequestCmd.FW_UPNP,
		url: "html/firewall/upnpIndex.html"
	},
	FW_DMZ: {
		cmd: RequestCmd.GET_DMZ,
		url: "html/firewall/dmzIndex.html"
	},
	FW_SWITCH: {
		cmd: RequestCmd.FW_SWITCH_SETTING,
		url: "html/firewall/fw_switch_setting.html"
	},
	REMOTE_WEB_PORT_SETTING: {
		cmd: RequestCmd.GET_DMZ,
		url: "html/firewall/remoteWebPortSettingIndex.html"
	},
	SIMPLE_ACCESS_CONTROL: {
		cmd: RequestCmd.FW_ACCESS_CONTROL,
		url: "html/firewall/accessControlIndex.html"
	},


	PARENT_MODEL:{
		cmd: RequestCmd.PARENT_MODEL,
		url: "html/parent/parentControlIndex.html"
	},
	PARENTAL_CONTROL_URL:{
		cmd: RequestCmd.PARENTAL_CONTROL_URL,
		url: "html/parent/parentUrlIndex.html"
	},
	PARENTAL_CONTROL_TIME:{
		cmd: RequestCmd.PARENTAL_CONTROL_TIME,
		url: "html/parent/parentTimeIndex.html"
	},
	PARENTAL_CONTROL_SPEED:{
		cmd: RequestCmd.PARENTAL_CONTROL_SPEED,
		url: "html/parent/parentSpeedIndex.html"
	},



	SMS_RECEIVE: {
		cmd: RequestCmd.SMS_INFO,
		url: "html/sms/smsInbox.html"
	},
	SMS_SEND: {
		cmd: RequestCmd.SMS_INFO,
		url: "html/sms/smsOutbox.html"
	},
	SMS_SETTING: {
		cmd: RequestCmd.SMS_INFO,
		url: "html/sms/smsSetting.html"
	},
	PHONE_BOOK: {
		cmd: RequestCmd.GET_PHONE_BOOK,
		url: "html/phoneBook/phoneBook.html"
	},
	SYS_SET: {
		cmd: RequestCmd.CHANGE_PASSWD,
		url: "html/sys/sysConfigIndex.html"
	},
	TIME_TO_RESTART: {
		cmd: RequestCmd.TIME_TO_RESTART,
		url: "html/sys/timeToRestart.html"
	},
	INTELLIGENT_SETTING:{
		cmd: RequestCmd.TIME_TO_RESTART,
		url: "html/sys/intelligentSettingIndex.html"
	},
	SYS_CHECK: {
		cmd: RequestCmd.SYS_INFO,
		url: "html/check/checkIndex.html"
	},
	SYS_LOG: {
		cmd: RequestCmd.SYS_LOG,
		url: "html/manage/sysLog.html"
	},
	EXPORT_LOG: {
		cmd: RequestCmd.EXPORT_LOG,
		url: "html/manage/exportLog.html"
	},
	LOG_INFO: {
		cmd: RequestCmd.LOG_INFO,
		url: "html/manage/logInfo.html"
	},
	MODULE_LOG: {
		cmd: RequestCmd.MODULE_LOG,
		url: "html/manage/moduleLog.html"
	},

	SYS_UPDATE: {
		cmd: RequestCmd.SYS_UPDATE,
		url: "html/update/sysUpdate.html"
	},
	SYS_AUTO_UPGRADE: {
		cmd: RequestCmd.SYS_AUTO_UPGRADE,
		url: "html/update/sysAutoUpdate.html"
	},
	FOTA_SETTINGS: { cmd: RequestCmd.FOTA_SETTINGS_NEW, url: "html/update/fota.html" },
	CONFIG_UPDATE: {
		cmd: RequestCmd.CONFIG_UPDATE,
		url: "html/update/configUpdate.html"
	},

	CHECKING_STATUS: {
		cmd: RequestCmd.LTE_AT,
		url: "html/manage/checkingStatus.html"
	},
	SEND_AT: {
		cmd: RequestCmd.SEND_AT,
		url: "html/manage/sysAt.html"
	},
	NETWORK_TOOLS: {
		cmd: RequestCmd.NETWORK_TOOLS,
		url: "html/tools/toolsIndex.html"
	},
	SYS_REBOOT: {
		cmd: RequestCmd.SYS_REBOOT,
		url: ""
	},
	DDOS_PROTECTION: {
		cmd: RequestCmd.DDOS_PROTECTION,
		url: "html/firewall/ddosIndex.html"
	},
	INDUSTRY_SETTING: { cmd: RequestCmd.INDUSTRY_SETTING, url: "html/industry/serialSettingIndex.html" },
	DIDO_SETTING: { cmd: RequestCmd.DIDO_SETTING, url: "html/industry/didoSettingIndex.html" },
	SERIAL_SETTING: {cmd: RequestCmd.SERIAL_SETTING,url: "html/industry/serialSettingIndex.html"},
	MQTT_SETTING: {cmd: RequestCmd.MQTT_SETTING,url: "html/industry/mqttSettingIndex.html"},
	TRAFFIC_STAT: {cmd: RequestCmd.TRAFFIC_STAT,url: "html/industry/trafficStatIndex.html"},
	DEVICE_SELF_CHECK:	{ cmd: RequestCmd.DEVICE_SELF_CHECK, url: "html/manage/deviceSelfCheck.html" },
};

var SortDirection = {
	ASC: "asc",
	DESC: "desc"
};

var UpdateType = {
	CLIENT: "CLIENT",
	SERVER: "SERVER"
};

var Network = {
	LAN: "LAN",
	WAN: "WAN"
};

var JSONMethod = {
	GET: "GET",
	POST: "POST"
};

var ConvertUtil = {
	ip4ToNum: function (ipStr) {
		var ips = this.ip4ToBytes(ipStr);
		var ip = "0x";
		var value, i;
		for (i = 0; i < 4; i++) {
			value = ips[i].toString(16);
			if (value.length == 1) {
				value = "0" + value;
			}
			ip += value;
		}

		return parseInt(ip, 16);
	},
	ip4ToBytes: function (ipStr) {
		var ips = ipStr.split(".");
		var length = ips.length;

		if (length != 4) {
			return null;
		}

		var temp, ip = [];
		for (var i = 0; i < length; i++) {
			temp = parseInt(ips[i], 10);
			if (isNaN(temp) || temp < 0 || temp > 255) {
				return null;
			}
			ip[i] = temp;
		}
		return ip;
	},
	parseSingalLevel: function (singalLevel) {
		var singalStd = [-94, -80, -75, -70, -65];
		var singalDesc = ["无信号", "非常差", "差", "一般", "好", "非常好"];
		var singalStdLength = singalStd.length;
		var singalLevelNum = parseInt(singalLevel, 10);
		var singalFlag = 1;
		if (!isNaN(singalLevelNum)) {
			if (singalLevelNum >= singalStd[singalStdLength - 1]) {
				singalFlag = singalStdLength;
			} else {
				for (var j = 0; j < singalStdLength; j++) {
					if (singalLevelNum < singalStd[j]) {
						singalFlag = j;
						break;
					}
				}
			}
		}
		return {
			level: singalFlag,
			desc: singalDesc[singalFlag]
		};
	},
	parseHex: function (hex) {
		if (!hex) return "0000";

		var bits = ['0000', '0001', '0010', '0011',
			'0100', '0101', '0110', '0111',
			'1000', '1001', '1010', '1011',
			'1100', '1101', '1110', '1111'
		];
		var sb = new StringBuilder();
		var length = hex.length;
		for (var i = 0, len = length; i < len; i++) {
			sb.append(bits[parseInt(hex.charAt(i), 16)]);
		}
		return sb.toString();
	},
	parseFindAp: function (datas, arrName) {
		var indexFlag = '"' + arrName + '":["';
		var index = datas.indexOf(indexFlag);
		if (index > 0) {
			var theData = datas.substring(index + indexFlag.length);
			index = theData.indexOf('"]');
			if (index > 0) {
				var arr = theData.substring(0, index).split('","');
				for (var i = 0; i < arr.length; i++) {
					arr[i] = arr[i].replaceQuote();
				}
				return arr;
			}
		}

		return [];
	},
	parseUptime: function (uptime, unit) {
		var runTime = "",
			runStatus = "";
		var uptimeReg = /^(.*)up(.*)\,\s*load\s*average\:(.*)$/;
		if (uptimeReg.test(uptime)) {
			runTime = RegExp.$2.replace('days', 'day').replace('day', unit.day).replace(':', unit.hour);
			if (runTime.indexOf('min') > 0) {
				runTime = runTime.replace('min', unit.min);
			} else {
				runTime = runTime + unit.min;
			}
			runStatus = RegExp.$3;
		}
		return {
			runTime: runTime,
			runStatus: runStatus
		};
	},
	parseUptime2: function (s) {
		var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整 
		var hour = Math.floor((s - day * 24 * 3600) / 3600);
		var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
		var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
		if (day > 0) {
			return day + DOC.unit.day + "," + hour + ":" + minute + ":" + second;
		} else {
			return hour + ":" + minute + ":" + second;
		}

	}
};

var SysUtil = {
	deviceName: null,
	rebootMessage: PROMPT.tips.rebootMessage,
	defaultRebootSettings: {
		rebootType: RENOOTTYPE.CONFIG_CHANGE,
		msg: PROMPT.saving.success,
		callback: null,
		hideConfirm: false
	},
	reboot: function (options) {
		var opts = $.extend({}, SysUtil.defaultRebootSettings, options);
		var msg = opts.msg.trim();
		var lastChar = msg.charAt(msg.length - 1);
		if (".,?!:;。？：！，；".indexOf(lastChar) < 0) {
			msg = msg + ', ';
		}
		SysUtil.rebootDevice(opts.rebootType, msg + SysUtil.rebootMessage, opts.callback, opts.hideConfirm);
	},
	reboot2: function (options) {
		var opts = $.extend({}, SysUtil.defaultRebootSettings, options);
		var msg = opts.msg.trim();
		var lastChar = msg.charAt(msg.length - 1);
		if (".,?!:;。？：！，；".indexOf(lastChar) < 0) {
			msg = msg + ', ';
		}

		SysUtil.rebootDevice2(opts.rebootType, msg + SysUtil.rebootMessage, opts.callback, opts.hideConfirm);
	},
	rebootDevice: function (rebootType, msg, callback, hideConfirm) {
		if (!rebootType) {
			rebootType = RENOOTTYPE.CONFIG_CHANGE;
		}

		if (!msg) msg = /*PROMPT.saving.success + */ this.rebootMessage;

		if (!hideConfirm) {

			fyConfirmMsg(msg, function () {
				if ($.isFunction(callback)) {
					callback(true);
				}
				fyAlertMsgLoading(PROMPT.status.rebooting + "," + CHECK.format.waiting);

				setTimeout(reboot, 3000);

				function reboot() {
					Page.isReboot = '1';//防止其他循环请求导致提前跳转至登陆界面，进而设备未完全起来进而报错问题
					// 发送重启命令
					Page.postJSON({
						json: {
							cmd: RequestCmd.SYS_REBOOT,
							rebootType: rebootType,
							method: JSONMethod.POST
						},
						success: function () {
						},
						//确认设备已经重启页面刷新
						complete: function () {
							function loop() {
								Page.postJSON({
									json: {
										cmd: RequestCmd.GET_SYS_STATUS
									},
									success: function () {
										setTimeout(function(){
											location.href = Page.getUrl(Url.LOGIN);
										},3000)
									},
									error: function () {
										setTimeout(loop, 3000);
									}
								})
							}
							setTimeout(loop, 5000);
						}
					});
				}
			})
		}
	},
	rebootDevice2: function (rebootType, msg, callback, hideConfirm) {
		if (!rebootType) {
			rebootType = RENOOTTYPE.CONFIG_CHANGE;
		}

		if (!msg) msg = /*PROMPT.saving.success + */ this.rebootMessage;

		if (!hideConfirm) {
			if ($.isFunction(callback)) {
				callback(true);
			}
			fyAlertMsgLoading(PROMPT.status.rebooting + "," + CHECK.format.waiting);
			setTimeout(reboot, 3000);

			function reboot() {
				Page.isReboot = '1';//防止其他循环请求导致提前跳转至登陆界面，进而设备未完全起来进而报错问题
				// 发送重启命令
				Page.postJSON({
					json: {
						cmd: RequestCmd.SYS_REBOOT,
						rebootType: rebootType,
						method: JSONMethod.POST
					},
					success: function () {
					},
					//确认设备已经重启页面刷新
					complete: function () {
						function loop() {
							Page.postJSON({
								json: {
									cmd: RequestCmd.GET_SYS_STATUS
								},
								success: function () {
									setTimeout(function(){
										location.href = Page.getUrl(Url.LOGIN);
									},3000)
								},
								error: function () {
									setTimeout(loop, 3000);
								}
							})
						}
						setTimeout(loop, 5000);
					}
				});
			}
		}
	},
	restoreRebootCancel: function () {
		fyAlertMsgLoading(PROMPT.status.rebooting+","+CHECK.format.waiting);
		setTimeout(function(){
			Page.postJSON({
				json: {
					cmd: RequestCmd.SYS_REBOOT,
					rebootType: RENOOTTYPE.RESTORE_REBOOT_CANCEL,
					method: JSONMethod.POST
				},
				success: function() {
				}
				});
		}, 1000);
	},
	showProgress: function (seconds, message, checkStatus, callback) {
		var $mask = $('#mask'),
			$box = $('#progress_box');
		var $progress = $('#progress_status'),
			$info = $('#progress_info');
		var h = document.documentElement.clientHeight;
		var w = document.documentElement.clientWidth;
		$mask.height(h);
		$mask.show();
		$box.show();
		SysUtil.setBoxStyle($box, w, h);

		var count = 1,
			delayCount = 2,
			maxCount = seconds * 10,
			ratio;
		var width = $('#progress_bar').width();

		function loop() {
			if (checkStatus()) {
				count += parseInt((maxCount - count) / delayCount) + 1;
			} else {
				ratio = maxCount / count;
				if (ratio >= 3) count += 3;
				else if (ratio >= 2) count += 2;
				else if (ratio > 1 && maxCount - count > delayCount) count++;
			}
			if (count <= maxCount) {
				$info.text(message + DOC.comma + PROMPT.status.progress + " " + parseInt((100 * count) / maxCount) + "%");
				$progress.width(parseInt((width * count) / maxCount));
				setTimeout(loop, 250);
			} else {
				callback();
			}
		}

		loop();
	},
	showProgress_2: function (message, checkStatus, callback) {
		var $mask = $('#mask'),
			$box = $('#progress_box');
		var $progress = $('#progress_status'),
			$info = $('#progress_info');
		var h = document.documentElement.clientHeight;
		var w = document.documentElement.clientWidth;
		$mask.height(h);
		$mask.show();
		$box.show();
		SysUtil.setBoxStyle($box, w, h);

		var count = 0;
		var width = $('#progress_bar').width();

		function loop() {
			count = checkStatus();
			$info.text(message + DOC.comma + PROMPT.status.progress + " " + count + "%");
			$progress.width(parseInt((width * count) / 100));
			if (count < 100) {
				setTimeout(loop, 500);
			} else {
				callback();
			}
		}
		loop();
	},
	setBoxStyle: function ($box, w, h) {
		$box.css({
			"left": parseInt(((w || document.documentElement.clientWidth) - $box.width()) / 2, 10) + "px",
			"top": parseInt(((h || document.documentElement.clientHeight) - $box.height()) / 2, 10) + "px"
		});
	},
	parseJSON: function (data) {
		var index = data.indexOf("{");
		if (index < 0) return {};

		// 从大括号开始计算json起始位置
		if (index > 0) {
			data = data.substring(data.indexOf("{"));
		}
		return JSON.parse(data);
	},
	getModule: function () {
		if (Page.imei && Page.modelVersion != "" && Page.modelVersion != "NULL") return true;

		var count = 0;

		function loop() {
			Page.postJSON({
				json: {
					cmd: RequestCmd.DEVICE_VERSION_INFO
				},
				success: function (data) {
					Page.module = data.module;
					Page.modelVersion = data.modversion;
					Page.imei = data.imei;
					if (data.modversion == "" || data.modversion == "NULL" || count++ < 20) {
						setTimeout(loop, 10000);
					}
				}
			});
		}
		loop();

		return false;
	},
	processMsg: function (message) {
		if (message == "NO_AUTH") {
			AlertUtil.alertMsg(PROMPT.status.noAuth);
			location.href = Page.getUrl(Url.LOGIN);
		} else {
			AlertUtil.alertMsg(message);
		}
	},
	upload: function ($form, $file, command, callback) {
		var url = String.format("{0}?cmd={1}&method=POST&sessionId={2}&language={3}&token={4}", Url.DEFAULT_CGI, RequestCmd.SYS_UPDATE, sessionStorage['sessionId'], Page.language,sessionStorage["token"]);

		//var url = "xml_action.cgi?Action=Upload&file=upgrade&command=" + command;

		var datas = null;
		//表单的提交
		$form.ajaxSubmit({
			url: url,
			type: 'POST',
			dataType: 'json',
			beforeSubmit: function () {
				var updateFileName = $file.val();
				if (updateFileName.length == 0) {
					AlertUtil.alertMsg(CHECK.required.uploadFile);
					return false;
				}
				if (/[\\\/]/.test(updateFileName)) {
					var matchs = updateFileName.match(/(.*)?[\\\/](.*)/);
					updateFileName = matchs[2];
				}
				if (!confirm(PROMPT.confirm.uploadFile + updateFileName)) {
					callback("");
					return false;
				}
				SysUtil.showProgress(ProgressTime.UPLOAD_FILE, PROMPT.status.uploading,
					function () {
						return datas != null;
					},
					function () {
						if (datas.success) {
							AlertUtil.alertMsg(PROMPT.status.uploadSuccess);
						} else {
							if (typeof datas.message === 'object') {
								SysUtil.processMsg("Error");
							} else {
								SysUtil.processMsg(datas.message);
							}

						}
						if ($.isFunction(callback)) {
							callback(updateFileName);
						}
					}
				);
				return true;


			},
			success: function (data, statusText) {
				datas = data;
			},
			error: function (responseText, statusText) {
				datas = {
					success: false,
					message: responseText
				};
			}
		});
	}
};

var FormatUtil = {
	formatValue: function (value) {
		if (!value || value == "NULL") {
			return '';
		}
		return value;
	},
	formatField: function (value, unit) {
		if (unit) {
			unit = unit;
		} else {
			unit = "";
		}
		if (value == "NULL") {
			//isNULLToSpace设置为false 此模式可以取消，注意在各页面使用完后要恢复默认值
			if (Page.isNULLToSpace) {
				return '';
			}
			return String.format("<span class=\"fail\">{0}</span>", DOC.status.getFailed);
		} else {
			return String.format("{0}{1}", value, unit).replaceQuote();
		}
	},
	formatNetState: function (value) {
		if (!value || value.trim() == "" || value == "NULL") {
			return "-";
		}
		return this.formatField(value);
	},
	/*此函数为搜网时调用，不是显示系统状态时调用*/
	formatSingalLevel: function (singalLevel, encryptionKey, requiredTitle) {
		var isEncrypted = (!!encryptionKey && encryptionKey == "on");
		var singal = ConvertUtil.parseSingalLevel(singalLevel);
		var title = String.format("信号强度：{0} &nbsp; {1}", singal.desc, singal.level > 0 ? (isEncrypted ? "是否加密：已加密" : "是否加密：未加密") : "");
		return {
			isEncrypted: isEncrypted,
			text: String.format("<span class=\"singal singal{0}{1}\"{2}>{3}&nbsp;dBm</span>",
				singal.level, isEncrypted ? "_lock" : "",
				(requiredTitle || false) ? String.format(" title=\"{0}\"", title) : "",
				singalLevel),
			title: title
		};
	},
	KB: 1,
	MB: 1024,
	GB: 1024 * 1024,
	formatByteSize: function (size) {
		if (size < this.MB) {
			return (size / this.KB).toFixed(2) + ' KB';
		} else if (size < this.GB) {
			return (size / this.MB).toFixed(2) + ' MB';
		} else {
			return (size / this.GB).toFixed(2) + ' GB';
		}
	},
	formatMaskBit: function (mask) {
		var tmp = mask.split(".");
		var bit = 0;
		for (var i = 0; i < 4; i++) {
			if (tmp[i] === "0") {
				break;
			}
			switch (tmp[i]) {
				case '255':
					bit += 8;
					break;
				case '254':
					bit += 7;
					break;
				case '252':
					bit += 6;
					break;
				case '248':
					bit += 5;
					break;
				case '240':
					bit += 4;
					break;
				case '224':
					bit += 3;
					break;
				case '192':
					bit += 2;
					break;
				case '128':
					bit += 1;
					break;
				default:
					bit = 0;
			}
		}
		return bit;
	},
	/** 计算一个IP 地址的大小 */
	ipChangeNum: function (ip) {
		var ip_str = "",
			ip_arr = ip.split(".");

		for (var i = 0; i < 4; i++) {
			var number_bin = ip_arr[i];
			var count = 3 - number_bin.length;
			for (var j = 0; j < count; j++) {
				number_bin = "0" + number_bin;
			}
			ip_str += number_bin;
		}
		return parseInt(ip_str);
	}
};

var Page = {
	wlan5g_preferred: '0',//5G优选是显示在2.4g 还是 5g 
	networkMode: '1', //网络模式
	logoPath: "", //mexico 定制,
	theme: "", //主题
	priorityStrategy: "",//通信策略 0-移动 1-WAN
	aeraId: "", //客户代号
	isTest: false,
	isNULLToSpace: false,
	connectStatus: true,
	currentId: 0,
	sessionId: "",
	webPageFlag: "0",
	language: DOC.language || "CN",
	allLanguage: "",
	languageList: "110",
	timer: null,
	getHash: "",
	onenet: "0",
	dm_platform: "0",
	isReboot:"0",//增加重启控制位，处于重启转态下其他其请求报错不跳转至登陆界面
	getSupportlanguageList: [{
		value: "cn",
		name: "中文",
		index: 0
	}, {
		value: "en",
		name: "English",
		index: 1
	}, {
		value: "th",
		name: "ไทย",
		index: 2
	}, {
		value: "el",
		name: "Español",
		index: 3
	}, {
		value: "por",
		name: "Português",
		index: 4
	},{
		value: "ar",
		name: "عربي",
		index: 6
	},{
		value: "fr", 
		name: "Français", 
		index: 7
	},{
		value: "cn_tc",
		name: "繁體中文",
		index: 13
	}], //cn,中文；en,英文；th，泰文;el,西班牙语；por:葡萄牙语；cn_tc繁体中文
	current_card_type: "0",
	esim_show: "0",
	iad_ready_status: "0",
	real_device: '',
	idu_dev_type: '',
	smsSw: "0",//短信功能开关
	level: "3",
	fw_switch:"1",
	isDowngrade: false,
	build_type: false,
	dhcpPortList: ['LAN1', 'LAN2', 'LAN3', 'LAN4', 'LAN5', 'LAN6', 'LAN7', 'LAN8',
		'2.4G SSID1', '2.4G SSID2', '2.4G SSID3', '2.4G SSID4', '2.4G SSID5', '2.4G SSID6', '2.4G SSID7', '2.4G SSID8',
		'5G SSID1', '5G SSID2', '5G SSID3', '5G SSID4', '5G SSID5', '5G SSID6', '5G SSID7', '5G SSID8',
		'USB', undefined, undefined, undefined, "6G SSID1", "6G SSID2", "6G SSID3", "6G SSID4",
	], //DHCP预留的所有列表端口数组
	getLanguageList: function (language) {
		var theLanguageList = Page.languageList;
		var length = theLanguageList.length;
		if (length <= 0) return '';
		var requiredDefault = (theLanguageList.charAt(length - 1) == "1");
		var sb = new StringBuilder();
		var langs = all_supported_language_info;
		var defaultLang = language.toLowerCase();
		var allLang = '';
		$.each(langs, function (name, value) {
			allLang += name.toUpperCase() + ',';
			var offset = parseInt(value.bit_offset, 10);
			if (offset < length && theLanguageList.charAt(length - offset - 1) == "1") {
				if (name === defaultLang) {
					sb.append(String.format('<option value="{0}" selected="selected">{1}</option>', name.toUpperCase(), LANG[name]));
				} else {
					if (requiredDefault) {
						sb.append(String.format('<option value="{0}">{1}({2})</option>', name.toUpperCase(), LANG[name], LANG[name + '_' + defaultLang]));
					} else {
						sb.append(String.format('<option value="{0}">{1}</option>', name.toUpperCase(), LANG[name]));
					}
				}
			}
		});
		Page.allLanguage = allLang;

		return sb.toString();
	},
	downloadFile:function(path, name) {
			var xhr = new XMLHttpRequest();
			xhr.open('get', path);
			xhr.responseType = 'blob';
			xhr.send();
			xhr.onload = function () {
					if (this.status === 200 || this.status === 304) {
							var fileReader = new FileReader();
							fileReader.readAsDataURL(this.response);
							fileReader.onload = function () {
									const a = document.createElement('a');
									a.style.display = 'none';
									a.href = this.result;
									a.download = name;
									document.body.appendChild(a);
									a.click();
									document.body.removeChild(a);
							};
					}
			};
	},
	changeLanguage: function ($languageSelect) {
		var languageSelect = $languageSelect.val();
		Page.postJSON({
			json: {
				cmd: RequestCmd.CHANGE_LANGUAGE,
				method: JSONMethod.POST,
				sessionId: "",
				languageSelect: languageSelect
			},
			success: function (data) { },
			complete: function () {
				var href = location.href;
				if (href.indexOf('#') > -1) {
					href = href.substring(0, href.indexOf('#'));
				}
				if (href.indexOf('?') > -1) {
					href = href.substring(0, href.indexOf('?'));
				}
				location.href = Page.getUrl(href);
			}
		});
	},
	transSecondTime:function(s){
 	var s=parseInt(s);
    var hour = Math.floor( s / 3600); 
    var minute = Math.floor( (s - hour*3600) /60 ); 
    var second = s - hour*3600 - minute*60; 
    if(s>3600)
 	{
 		 return  hour + ":" + minute + ":" + second; 
 	}else
 	{
 		 return  minute + ":" + second; 
 	}
 
	},
	requireChangeLang: function (language) {
		if (!Page.allLanguage) {
			Page.getLanguageList('CN');
		}
		return language.length > 0 && Page.allLanguage.indexOf(language) >= 0 && language != Page.language;
	},
	isChinese: function () {
		return Page.language == "CN";
	},
	alertTimes: 0,
	defaultAlertTimes: 100,
	$iframe: null,
	menuItem: null,
	module: "",
	itemHide: "0000",
	itemDisable: "0000",
	isItemHide: function (itemHideTable) {
		var itemHide = Page.itemHide;
		var lastIndex = itemHideTable.index;
		if (lastIndex >= itemHide.length) return itemHideTable.emptyHide;

		if (itemHide.charAt(itemHide.length - 1 - lastIndex) == itemHideTable.hideFlag)
			return true;
		else
			return false;
	},
	isSupported: function (lastIndex, supportFlag) {
		if (supportFlag) {
			var supported = Page.supported || "0000";
			if (lastIndex >= supported.length) return false;
			return supported.charAt(supported.length - 1 - lastIndex) == "1" ? true : false;
		} else {
			var unsupported = Page.unsupported || "0000";
			if (lastIndex >= unsupported.length) return true;
			return unsupported.charAt(unsupported.length - 1 - lastIndex) == "0" ? true : false;
		}
	},

	setMenu: function (id, itemHideTable) {
		if (Page.isItemHide(itemHideTable)) {
			$(id).detach();
		} else {
			$(id).show();
		}
	},
	parseHex: function (hex) {
		// 进制转换 parseInt() 函数有最大 2 的 53 次方位限制
		if (!hex) return ['0000'];
		var bits = ['0000', '0001', '0010', '0011',
			'0100', '0101', '0110', '0111',
			'1000', '1001', '1010', '1011',
			'1100', '1101', '1110', '1111'
		];
		var arr = [];
		var length = hex.length;
		for (var i = 0, len = length; i < len; i++) {
			arr.push(bits[parseInt(hex.charAt(i), 16)]);
		}
		return arr;
	},
  parseHexToBinary: function (hex) {
    if (!hex) return ['0000'];
    let bits = ['0000', '0001', '0010', '0011',
        '0100', '0101', '0110', '0111',
        '1000', '1001', '1010', '1011',
        '1100', '1101', '1110', '1111'
    ];
    let arr = [];
    let length = hex.length;
    for (let i = 0, len = length; i < len; i++) {
        arr.push(bits[parseInt(hex.charAt(i), 16)]);
    }
    return arr;
  },
	parseHexPageHide: function (hex) {
		if (!hex) return ["00"];
		var bits = ["00", "01", "02", "03",
			"10", "11", "12", "13",
			"20", "21", "22", "23",
			"30", "31", "32", "33"
		];
		var arr = [];
		var length = hex.length;
		for (var i = 0, len = length; i < len; i++) {
			arr.push(bits[parseInt(hex.charAt(i), 16)]);
		}
		return arr.join("").split("").reverse();
	},
	pageHideCheck: function (index) {
		var arr = Page.webPageFlag;
		if (arr[index] == "1") {
			if (Page.level == "1" || Page.level == "2") {
				return true;
			} else {
				return false;
			}
		} else if (arr[index] == "2") {
			if (Page.level == "1" || Page.level == "2" || Page.level == "3") {
				return true;
			} else {
				return false;
			}
		} else if (arr[index] == "3") {
			return true;
		} else {
			if (Page.level == "1") {
				return true;
			} else {
				return false;
			}
		}
	},
	//配置取反
	pageHideCheck2: function (index) {
		var arr = Page.webPageFlag;
		if (arr[index] == "1") {
			if (Page.level == "1" || Page.level == "2") {
				return true;
			} else {
				return false;
			}
		} else if (arr[index] == "2") {
			if (Page.level == "1" || Page.level == "2" || Page.level == "3") {
				return true;
			} else {
				return false;
			}
		} else if (arr[index] == "3") {
			if (Page.level == "1") {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	},
	//格式化 MAC
	formatMAC(mac) {
		if (!mac) return mac;
		return mac.match(/[0-9a-f]{2}/ig).join(":").toUpperCase();
	},
	// 默认只在高级账号显示
	pageHideCheck3: function (index) {
		var arr = Page.webPageFlag;
		if (arr[index] == "1") {
			return true;
		} else if (arr[index] == "2") {
			if (Page.level == "1" || Page.level == "2" || Page.level == "3") {
				return true;
			} else {
				return false;
			}
		} else if (arr[index] == "3") {
			if (Page.level == "1") {
				return true;
			} else {
				return false;
			}
		} else {
			if (Page.level == "1" || Page.level == "2") {
				return true;
			} else {
				return false;
			}
		}
	},
  supportsFeature: function (id) {
    if (!id || !Page.featureSupportInfo) return false;
    return Page.featureSupportInfo[id] == "1"
  },
	createForm: function (arr) {
		if (!arr) return;
		if (arr.length <= 0) return;
		var form = document.createElement("form");
		$(form).attr('id', arr[0]);
		$(form).appendTo('#' + arr[1]);
		$("#" + arr[2]).appendTo(form);
	},
	createForm2: function (arr) {
		if (!arr) return;
		if (arr.length <= 0) return;
		var form = document.createElement("form");
		$(form).attr('id', arr[0]);
		$(form).appendTo('#' + arr[1]);
		$("#" + arr[2]).appendTo(form);
	},
	initPage: function (isLogin) {
		var $header = $('#header');
		if (!Page.hasGetLogo) {
			Page.postJSON({
				json: {
					cmd: RequestCmd.INIT_PAGE
				},
				success: function (data) {
					Page.web_unlimit_upload_upgrade_package_size = data.web_unlimit_upload_upgrade_package_size;
					Page.wlan5g_preferred = data.wlan5g_preferred;
					Page.hasGetLogo = true;
					Page.enableChannelOneToFour = (data.channelOneToFour == "yes");
					Page.disableChannelEnds = (data.hideChannel12And13 == "yes");
					var logoPath = (data.web_logo_path || "").trim();
					if (logoPath != "NULL" && logoPath.length > 0) {
						if(logoPath == 'CN0593.png' && data.language == 'cn_tc'){
							logoPath = 'CN0593-cn.png'
						}
						var background = String.format("url(/images/{0})", logoPath);
						$header.css({
							"background-image": background,
							"background-repeat": "no-repeat",
							"background-position": "20px center"
						});
					} else {
						if (data.isLogoExists == "1") {
							$header.addClass("header_logo");
						} else {
							$header.addClass("header_default");
						}
					}
					if (data.deviceType == 'NULL') {
						data.deviceType = '';
					}
					Page.displayedVersion = data.displayedVersion;
					if (Page.displayedVersion == 'NULL') {
						Page.displayedVersion = '';
					}
				}
			});

			if (!isLogin) {
				Page.killSearchPlmn();
			}
		}
		var headerH = 71,
			footerH = 31;
		var w = Math.max(document.documentElement.clientWidth, 1000);
		var h = Math.max(document.documentElement.clientHeight - headerH - footerH, 450);
		$('#main').height(h);
		$('#left').height(h);
		$('#left_m').height(h - 30);
		Page.footerImg = "/images/mexico/home_footer.png";  //避免图片渲染过快
		var $right = $('#right');
		$right.css({
			"padding-top": "15px"
		});
		var left = $('#left').width() + 1;
		var right = w - left;
		$right.width(right);
		$right.height(h - 15);

		if (isLogin) {
			var left = (((w - 402) / 2) - 400);
			left = Math.max(left, 0);
			$('#login').css({
				"left": left + "px",
				"top": ((h - 302) / 2 - 50) + "px"
			});
			$('#check_box_left .check_info').css({
				"width": (right / 2 - 40) + "px"
			});
			$('#check_box_right .check_info').css({
				"width": (right / 2 - 30) + "px"
			});
			$('#device_check').css({
				"left": "20px",
				"width": (right - 40) + "px",
				"height": (h - 20) + "px"
			});
		} else { }

		$header.width(w);
		$('#footer').width(w);

		var $mask = $('#mask');
		if ($mask.is(":visible")) {
			$mask.height(document.documentElement.clientHeight);
		}

		var $box = $('#info_box');
		if ($box.is(":visible")) {
			SysUtil.setBoxStyle($box, w, h);
		}

		$box = $('#progress_box');
		if ($box.is(":visible")) {
			SysUtil.setBoxStyle($box, w, h);
		}
	},
	setStripeTable: function (id) {
		var $tab = $(id || 'table.detail');
		$('tr:odd', $tab).addClass("odd");
		$('tr:even', $tab).addClass("even");
		$('tr:first', $tab).removeClass("even");
	},
	getRandomParam: function () {
		return "_t=" + Math.floor(Math.random() * 10000000);
	},
	getUrl: function (url) {
		return String.format("{0}?{1}", url, Page.getRandomParam());
	},
	getHtml: function (url, subcmd, callback) {
		Page.postJSON({
			returnHtml: true,
			json: {
				cmd: RequestCmd.GET_HTML,
				url: url,
				subcmd: subcmd || 0
			},
			success: function (data) {
				if (data.indexOf('"message":"NO_AUTH"') > 0) {
					location.href = Page.getUrl(Url.LOGIN);
				} else {
					callback(data);
				}
			}
		});
	},
	getFileData: function (url, subcmd, callback) {
		Page.postJSON({
			returnHtml: true,
			json: {
				cmd: RequestCmd.GET_FILE_DATA,
				url: url,
				subcmd: subcmd || 0
			},
			success: function (data) {
				if (data.indexOf('"message":"NO_AUTH"') > 0) {
					location.href = Page.getUrl(Url.LOGIN);
				} else {
					callback(data);
				}
			}
		});
	},
	writeTime: function (subcmd) {
		Page.postJSON({
			json: {
				cmd: RequestCmd.WRITE_TIME,
				method: JSONMethod.POST,
				subcmd: subcmd,
				time: new Date().format('yyyy-mm-dd HH:MM')
			},
			success: function (data) { }
		});
	},
	postJSON: function (options, timeout) {
		var settings = $.extend({}, Page.defaultSetting, options);
		var json = settings.json;
		var getMethod;
		if (!json.method) {
			json.method = JSONMethod.GET;
		}
		if(json.method == "POST")
		{
			getMethod="POST";
			json.token = sessionStorage["token"];
		}else
		{
			getMethod="GET";
		}
		if (!json.language) {
			json.language = Page.language;
		}
		if (!json.sessionId) {
			json.sessionId = sessionStorage['sessionId'] || "";

		}
		if (Page.isTest) {
			return;
		} else {
			var $id = settings.$id;
			if ($id) {
				$id.disable();
			}
			$.ajax({
				url: settings.url,
				type: 'POST',
				timeout: timeout || settings.timeout,
				data: JSON.stringify(json),
				dataType: 'text',
				beforeSend: function (xhr) {
					//xhr.setRequestHeader("Authorization", 'Digest username="admin", realm="Highwmg", nonce="1000", uri="/cgi/xml_action.cgi", response="c4a96d6622ef9a7ec485afcdb82c4459", qop=auth, nc=00000015, cnonce="e7dace847a70f733"');
				},
				success: function (datas) {
          
					try {
						var data;
						if (json.cmd == RequestCmd.FIND_AP && datas.indexOf("ssids") > 0) {
							// 单独解析 FIND_AP
							data = {};
							data.success = true;
							data.cmd = RequestCmd.FIND_AP;
							data.macs = ConvertUtil.parseFindAp(datas, "macs");
							data.ssids = ConvertUtil.parseFindAp(datas, "ssids");
							data.frequencys = ConvertUtil.parseFindAp(datas, "frequencys");
							data.singalLevels = ConvertUtil.parseFindAp(datas, "singalLevels");
							data.encryptionKeys = ConvertUtil.parseFindAp(datas, "encryptionKeys");
							data.encryptionModes = ConvertUtil.parseFindAp(datas, "encryptionModes");
							data.groupCiphers = ConvertUtil.parseFindAp(datas, "groupCiphers");
							data.pairwiseCiphers = ConvertUtil.parseFindAp(datas, "pairwiseCiphers");
							data.authenticationSuites = ConvertUtil.parseFindAp(datas, "authenticationSuites");
						} else {
							if (!settings.returnHtml) {
								data = SysUtil.parseJSON(datas);
							} else {
								// 返回 HTML 不用解析
								data = datas;
							}
						}
						Window.isOther = false;
						if (!settings.returnHtml) {
							if (data.cmd == undefined) return;

							if (data.success) {
								settings.success(data);
							} else {
								if ((data.message == "NO_AUTH" || data.message == "LOGIN_TIMEOUT") && Page.isReboot !='1') {
									sessionStorage.clear();
									if (Page.timer) {
										_clearInterval();
									}
									if(window.TIMEOUT2) {
										clearTimeout(window.TIMEOUT2);
										window.TIMEOUT2 = null;
									}
									Window.isOther = true;
									if (data.message == "LOGIN_TIMEOUT") {
										AlertUtil.alertMsg(CHECK.tip.loginTimeout);
									}
									// if (!IsPC()) {
									// 	location.href = Page.getUrl("/mobile_web/login.html");
									// } else {
										location.href = Page.getUrl(Url.LOGIN);
									// }
									return;
								}
								if ($.isFunction(settings.fail)) {
									settings.fail(data);
								} else {
									if (data.message && Page.isReboot !='1') {
										if($('.fy-alert-box').is(':visible')) {
											fyAlertDestory();
										}
										if(data.message = "Illegal character input"){
										// AlertUtil.alertMsg(CHECK.tip.urlOrIp);
                      settings.fail(data);
										}else{
											AlertUtil.alertMsg(data.message)
										}
									} else {
                    settings.fail(data);
                  }
								}
							}
						} else {
							settings.success(data);
						}
					} catch (ex) {
						//AlertUtil.alertMsg("[EXCEPTION]" + ex.message);
					}
				},
				error: function (xhr, textStatus, error) {
					if ($.isFunction(settings.error)) {
						settings.error(xhr, textStatus, error);
					}
				},
				complete: function () {
					if(getMethod == "POST")
					{
						if(json.cmd == "269" || json.cmd == "100" || json.cmd == "101" || json.cmd == "97")
						{
						}else
						{
							resetTime();
						}
					}
					settings.complete();
					if ($id) {
						$id.enable();
					}
				}
			});
		}
	},
  postSyncJSON: function (options, timeout) {
    return new Promise(function(resolve, reject) {
      var settings = $.extend({}, Page.defaultSetting, options);
      var json = settings.json;
      var getMethod;
      if (!json.method) {
        json.method = JSONMethod.GET;
      }
      if(json.method == "POST")
      {
        getMethod="POST";
        json.token = sessionStorage["token"];
      }else
      {
        getMethod="GET";
      }
      if (!json.language) {
        json.language = Page.language;
      }
      if (!json.sessionId) {
        json.sessionId = sessionStorage['sessionId'] || "";
  
      }
      if (Page.isTest) {
        return;
      } else {
        var $id = settings.$id;
        if ($id) {
          $id.disable();
        }
        $.ajax({
          url: settings.url,
          type: 'POST',
          timeout: timeout || settings.timeout,
          data: JSON.stringify(json),
          dataType: 'text',
          beforeSend: function (xhr) {
            //xhr.setRequestHeader("Authorization", 'Digest username="admin", realm="Highwmg", nonce="1000", uri="/cgi/xml_action.cgi", response="c4a96d6622ef9a7ec485afcdb82c4459", qop=auth, nc=00000015, cnonce="e7dace847a70f733"');
          },
          success: function (datas) {
            try {
              var data;
              if (json.cmd == RequestCmd.FIND_AP && datas.indexOf("ssids") > 0) {
                // 单独解析 FIND_AP
                data = {};
                data.success = true;
                data.cmd = RequestCmd.FIND_AP;
                data.macs = ConvertUtil.parseFindAp(datas, "macs");
                data.ssids = ConvertUtil.parseFindAp(datas, "ssids");
                data.frequencys = ConvertUtil.parseFindAp(datas, "frequencys");
                data.singalLevels = ConvertUtil.parseFindAp(datas, "singalLevels");
                data.encryptionKeys = ConvertUtil.parseFindAp(datas, "encryptionKeys");
                data.encryptionModes = ConvertUtil.parseFindAp(datas, "encryptionModes");
                data.groupCiphers = ConvertUtil.parseFindAp(datas, "groupCiphers");
                data.pairwiseCiphers = ConvertUtil.parseFindAp(datas, "pairwiseCiphers");
                data.authenticationSuites = ConvertUtil.parseFindAp(datas, "authenticationSuites");
              } else {
                if (!settings.returnHtml) {
                  data = SysUtil.parseJSON(datas);
                } else {
                  // 返回 HTML 不用解析
                  data = datas;
                }
              }
              Window.isOther = false;
              if (!settings.returnHtml) {
                if (data.cmd == undefined) {
                  reject(data);
                  return;
                };
  
                if (data.success) {
                  settings.success(data);
                  resolve(data);
                } else {
                  if ((data.message == "NO_AUTH" || data.message == "LOGIN_TIMEOUT") && Page.isReboot !='1') {
                    sessionStorage.clear();
                    if (Page.timer) {
                      _clearInterval();
                    }
                    if(window.TIMEOUT2) {
                      clearTimeout(window.TIMEOUT2);
                      window.TIMEOUT2 = null;
                    }
                    if(window.WPS_TIMEOUT) {
                      clearTimeout(window.WPS_TIMEOUT);
                      window.WPS_TIMEOUT = null;
                    }
                    Window.isOther = true;
                    if (data.message == "LOGIN_TIMEOUT") {
                      AlertUtil.alertMsg(CHECK.tip.loginTimeout);
                    }
                    // if (!IsPC()) {
                    // 	location.href = Page.getUrl("/mobile_web/login.html");
                    // } else {
                      location.href = Page.getUrl(Url.LOGIN);
                    // }
                    reject(data);
                    return;
                  }
                  if ($.isFunction(settings.fail)) {
                    settings.fail(data);
                  } else {
                    if (data.message && Page.isReboot !='1') {
                      if($('.fy-alert-box').is(':visible')) {
                        fyAlertDestory();
                      }
                      if(data.message = "Illegal character input"){
                      // AlertUtil.alertMsg(CHECK.tip.urlOrIp);
                      }else{
                        AlertUtil.alertMsg(data.message)
                      }
                    }
                  }
                }
                reject(data);
              } else {
                settings.success(data);
              }
            } catch (ex) {
              //AlertUtil.alertMsg("[EXCEPTION]" + ex.message);
            }
          },
          error: function (xhr, textStatus, error) {
            if ($.isFunction(settings.error)) {
              settings.error(xhr, textStatus, error);
            }
            reject(error);
          },
          complete: function () {
            if(getMethod == "POST")
            {
              if(json.cmd == "269" || json.cmd == "100" || json.cmd == "101" || json.cmd == "97")
              {
              }else
              {
                resetTime();
              }
            }
            settings.complete();
            if ($id) {
              $id.enable();
            }
            resolve();
          }
        });
      }
    })
	},
	defaultSetting: {
		url: Url.DEFAULT_CGI,
		timeout: 0,
		returnHtml: false,
		success: function () { },
		complete: function () { }
	},
	killSearchPlmn: function () {

	},
	setHash: function (hash) {
		var dataHash;
		if(window.btnStopClick) {
			window.btnStopClick();
			window.btnStopClick = null;
		}
		Page.postJSON({
			json: {
				cmd: RequestCmd.SET_HASH,
				method: JSONMethod.POST,
				setHash: hash
			},
			success: function (data) { }
		});
	},
	getHash: function () {
		var dataHash;
		var json = {};
		json.cmd = RequestCmd.SET_HASH;
		json.method = JSONMethod.GET;
		json.sessionId = sessionStorage['sessionId'];
		$.ajax({
			url: Url.DEFAULT_CGI,
			type: 'POST',
			data: JSON.stringify(json),
			dataType: 'text',
			async: false,
			success: function (data) {
				var datas = SysUtil.parseJSON(data);
				dataHash = datas.setHash;
			}
		})
		return dataHash;
	},
	destory: function () {
		Page.currentId++;
		if (Page.isSearchingPlmn) {
			Page.isSearchingPlmn = false;
			Page.killSearchPlmn();
		}
	},
	createTable: function (title, names, values, count, columnNum, css) {
		var sb = new StringBuilder();
		sb.append(Page.createTableHead(title, css));

		if (count <= 0 || columnNum <= 0) return sb.toString();

		Page.createTableBody(sb, names, values, count, columnNum, css);

		return sb.toString();
	},
	createTableHead: function (title, css) {
		if (!css) {
			css = "detail";
		} else {
			css = "detail " + css;
		}

		return String.format("<div class=\"{0}\">{1}</div>", css, title);
	},
	createTableBody: function (sb, names, values, count, columnNum, css) {
		if (!css) {
			css = "detail";
		} else {
			css = "detail " + css;
		}

		sb.append(String.format("<table class=\"{0}\" cellspacing=\"0\">", css));

		var columnCount = 0;
    var colon = (Page.isChinese() ? ":" : ":");
		for (var i = 0; i < count; i++) {
			if (i % columnNum == 0) {
				sb.append("<tr>");
			}

			// 输出 th
			sb.append("<th>");
			if (!names[i]) {
				sb.append("&nbsp;</th>");
			} else {
				sb.append(names[i]);
				sb.append(colon);
				sb.append("</th>");
			}

			// 输出 td
			var colspan = false;
			if (columnNum == 2 && (i + 1) < count && !names[i + 1]) {
				// colspan
				colspan = true;
				sb.append('<td colspan="3">');
			} else {
				sb.append("<td>");
			}
			if (values[i].length == 0) {
				sb.append("&nbsp;</td>");
			} else {
				sb.append(values[i]);
				sb.append("</td>");
			}

			columnCount++;
			if (colspan || columnCount == columnNum) {
				sb.append("</tr>");
				columnCount = 0;
			}
			if (colspan) {
				i++;
			}
		}
		if (columnCount != 0) {
			// 补充输出 th,td
			for (var i = columnCount; i < columnNum; i++) {
				sb.append("<th>&nbsp;</th><td>&nbsp;</td>");
			}
			sb.append("</tr>");
		}
		sb.append("</table>");
	},
	sortAp: function (data, field, sortDirection) {
		var count = data.ssids.length;
		var ssids = data.ssids,
			macs = data.macs,
			frequencys = data.frequencys,
			singalLevels = data.singalLevels,
			encryptionKeys = data.encryptionKeys,
			encryptionModes = data.encryptionModes,
			groupCiphers = data.groupCiphers,
			pairwiseCiphers = data.pairwiseCiphers,
			authenticationSuites = data.authenticationSuites;

		for (var i = 0; i < count - 1; i++) {
			singalLevels[i] = parseInt(singalLevels[i], 10);
		}

		var fields = eval(field);
		var isAsc = (sortDirection == SortDirection.ASC);
		for (var i = 0; i < count - 1; i++) {
			for (var j = i + 1; j < count; j++) {
				if (isAsc) {
					if (fields[j] < fields[i]) {
						swapAll(i, j);
					}
				} else {
					if (fields[j] > fields[i]) {
						swapAll(i, j);
					}
				}
			}
		}

		var min;

		function swap(arr, i, j) {
			min = arr[j];
			arr[j] = arr[i];
			arr[i] = min;
		}

		function swapAll(i, j) {
			swap(ssids, i, j);
			swap(macs, i, j);
			swap(frequencys, i, j);
			swap(singalLevels, i, j);

			swap(encryptionKeys, i, j);
			swap(encryptionModes, i, j);
			swap(groupCiphers, i, j);
			swap(pairwiseCiphers, i, j);
			swap(authenticationSuites, i, j);
		}
	},
	getDeviceName: function () {
		Page.postJSON({
			json: {
				cmd: RequestCmd.GET_DEVICE_NAME,
				method: JSONMethod.GET,
				sessionId: ""
			},
			success: function () { },
		});
	},
	render: function (containerId, templateId, datas) {
		if (!containerId) containerId = '#child_container';
		if (!templateId) templateId = '#child_template';
		if (!datas) datas = DOC;

		$(containerId).html(_.template($(templateId).html(), datas));
	},
	applyFilter: function () {
		Page.postJSON({
			json: {
				cmd: RequestCmd.APPLY_FILTER,
				method: JSONMethod.POST
			},
			success: function (data) {
				if (data.success == true) {
					fyAlertMsgSuccess();
				} else {
					fyAlertMsgFail();
				}
			}
		});
	}
};

var CheckUtil = {
	isEmpty: function (value) {
		return !value || value.length == 0 || value == 'NULL';
	},
	checkIp: function (ip, ipType) {
		var ipv4 = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
		var ipv6 = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i;
		if (ipType == "IPV6") {
			return ipv6.test(ip);
		} else {
			if (ipv4.test(ip)) {
				var tmp = ip.split('.');
				for(var i = 0;i < tmp.length;i++){
					if(tmp[i].length > 1 && tmp[i][0] == '0'){
						return false;
					}
				}
			}
			return ipv4.test(ip) && tmp[0] != "0" && tmp[0] < 224 && tmp[0] != 127  && tmp[3] != "0" && tmp[3] != "255";
		}
	},
	checkIpSegment: function (ip, ipType) {
		var ipv4 = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
		var ipv6 = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i;
		if (ipType == "IPV6") {
			if (ip.split('/').length == 1) {
				return ipv6.test(ip);
			}else if (ip.split('/').length == 2) {
				const [address, mask] = ip.split('/')
				return ipv6.test(address) && !(!Number(mask) || Number(mask) < 1 || Number(mask) > 64);
			}
		} else {
			if (ip.split('/').length == 1) {
				if (ipv4.test(ip)) {
					var tmp = ip.split('.');
					for (var i = 0; i < tmp.length; i++) {
						if (tmp[i].length > 1 && tmp[i][0] == '0') {
							return false;
						}
					}
				}
				return ipv4.test(ip) && tmp[0] != "0" && tmp[0] < 224 && tmp[0] != 127 && tmp[3] != "0" && tmp[3] != "255";
			} else if (ip.split('/').length == 2) {
				const cidrRegex = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\/(?:[1-9]|[12]\d|3[0-2])$/
				return cidrRegex.test(ip)
			}
		}
	},
	checkIpRoute: function (ip) {
		if (ip == '0.0.0.0') return true
		var ipv4 = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
		if (ipv4.test(ip)) {
			var tmp = ip.split('.');
			for (var i = 0; i < tmp.length; i++) {
				if (tmp[i].length > 1 && tmp[i][0] == '0') {
					return false;
				}
			}
		}
		return ipv4.test(ip) && tmp[0] != "0" && tmp[0] < 224 && tmp[3] != "255";
	},
	checkMac: function (mac) {
		var reg = /^([0-9a-f]{2}[\:\-]{0,1}){5}[0-9a-f]{2}$/i;
		return reg.test(mac);
	},
	/**
	 * 禁止MAC地址输入组播或广播地址 
	 * @param mac 
	 * @returns 
	 */
	checkInvalidMac: function (mac) {
		var invalidMac = ['FF:FF:FF:FF:FF:FF', '00:00:00:00:00:00', '01:00:00:00:00:00'];
		var char = parseInt(mac.split(':')[0],16).toString(2).slice(-1)
		if(char=='1') return false
		return invalidMac.indexOf(mac) === -1;
	},
	checkPort: function (port) {
		var thePort = parseInt(port, 10);
		if (isNaN(thePort) || thePort < 0 || thePort > 65535) return {
			isValid: false
		};
		return {
			isValid: true,
			port: thePort
		};
	},
	checkIpPort: function (ipPort) {
		var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:(\d+)$/;
		if (!reg.test(ipPort)) return false;
		var port = parseInt(RegExp.$5, 10);
		if (isNaN(port) || port < 0 || port > 65535) return false;
		return true;
	},
	checkNumber: function (num) {
		var reg = /^\d+$/;
		return reg.test(num);
	},
	checkHex: function (hex) {
		var reg = /^[0-9A-F]*$/gi;
		return reg.test(hex);
	},
	checkASCII: function (ascii) {
		var reg = /[\x00-\xff]/g;
		return reg.test(ascii);
	},
	checkAPNName: function (value) {
		var reg = /^[0-9a-zA-Z!#$&()*\+,\-\.\/%:;<=>?@\[\]^_\{|\}~]*$/;
		// var reg = /^(?!rac|lac|sgsn|\.)(?!.*\.gprs$)^(?!.*\.\.)^(?!.*-\.)^(?!.*\.-)[\.a-zA-Z0-9-]{1,63}$/;
		return reg.test(value);
	},
	checkAPNName_right: function (value) {
		// var reg = /^[0-9a-zA-Z!#$&()*\+,\-\.\/%:;<=>?@\[\]^_\{|\}~]*$/;
		var reg = /^(?!rac|lac|sgsn|\.)(?!.*\.gprs$)^(?!.*\.\.)^(?!.*-\.)^(?!.*\.-)[\.a-zA-Z0-9-\s]{1,63}$/;
		return reg.test(value) && value.toLowerCase() != 'auto';
	},
	checkSSIDName: function (value) {
		var reg = /^[0-9a-zA-Z!#$&()\s*\+,\-\.\/%:;<=>?@\[\]^_\{|\}~]*$/;
		return reg.test(value);
	},
	checkForm: function ($form, rules, messages) {
		var validate = $form.validate({
			ignore: ".ignore",
			rules: rules,
			messages: messages
		});
		//jquery-validate 验证插件，属性 form（）表示验证有没有通过。通过为 true，没通过为 false.
		return validate.form();
	},
	checkPwd: function (pwd) {
		var asciiReg = /^[\x00-\xff]{8,63}$/;
		var hexReg = /^[0-9A-F]{64}$/;
		return asciiReg.test(pwd) || hexReg.test(pwd);
	},
	checkeWepPwd68: function (pwd) {
		var asciiReg = /^[\x00-\xff]{5}$/;
		var hexReg = /^[0-9A-F]{10}$/;
		return asciiReg.test(pwd) || hexReg.test(pwd);
	},
	checkeWepPwd128: function (pwd) {
		var asciiReg = /^[\x00-\xff]{13}$/;
		var hexReg = /^[0-9A-F]{26}$/;
		return asciiReg.test(pwd) || hexReg.test(pwd);
	},
	checkNetSegment: function (lanip, netMask, ip) {
		var lanips = ConvertUtil.ip4ToNum(lanip);
		var netMasks = ConvertUtil.ip4ToNum(netMask);
		var ips = ConvertUtil.ip4ToNum(ip);

		return (lanips & netMasks) == (ips & netMasks);
	},
	checkExeCmd: function (value) {
		var reg = /.*/;
		return reg.test(value);
	},
	checkPlmn: function (value) {
		var reg = /^[0-9]{3,4}-[0-9]{2,3}$/;
		return reg.test(value);
	},
	checkMask: function (value) {
		var reg = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0)$/;
		return reg.test(value);
	},
	checkRange: function (interval, min, max) {
		var key = parseInt(interval, 10);
		if (isNaN(key) || key < min || key > max) return false;
		return true;
	},
	checkCN: function (value) { //只能字母，数字，符号
		var reg = /^[0-9a-zA-Z\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*[^ ]$/;
		// var reg = /^[0-9a-zA-Z\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*(?<!\s)$/;
		return reg.test(value);
	},
	checkIpv6_prefix: function (value,flag){
		if(flag && value=="") return true
		function validateIPv6MulticastAddress(address) {
			// IPv6 组播地址的范围为 FF00::/8，其中 FF01 到 FF0F 为预留地址
			const ipv6MulticastRegex = /^ff[0-9a-f]{2}:/;
			return ipv6MulticastRegex.test(address);
		}
		// 判断 ipv6 回环地址
		function isIPv6LoopbackAddress(ip) {
			// 将 IPv6 地址转换为标准格式
			ip = ip.toLowerCase().replace(/(^|:)0+:/, '$1').replace(/::/, ':0:');
			// 匹配 IPv6 回环地址的正则表达式
			var regex = /^::1$|^::ffff:127\.0\.0\.1$/;
			return regex.test(ip);
		}
		var valArr = value.split('/')
		var reg = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i;
		var reg1 = valArr[1] >= 1 && valArr[1] <= 128
		if(!reg1){
			return false 
		}
		if(validateIPv6MulticastAddress(value)){
			return false
		}
		if(isIPv6LoopbackAddress(value)){
			return false
		}
		if (reg.test(valArr[0]) || !value) {
			return true
		} else {
			return false
		}
	},
	checkIpv6: function(value,flag){
		if(flag && value=="") return true
		var reg = /:/.test(value)
			&& value.match(/:/g).length < 8
			&& /::/.test(value)
			? (value.match(/::/g).length == 1
				&& /^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?$/i.test(value))
			: /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(value);
	
		return reg
	},
	checkIpv4AllowEmpty: function (ip) {
		if (!ip || ip == '') return true
		var ipv4 = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
		if (ipv4.test(ip)) {
			var tmp = ip.split('.');
			for (var i = 0; i < tmp.length; i++) {
				if (tmp[i].length > 1 && tmp[i][0] == '0') {
					return false;
				}
			}
		}
		return ipv4.test(ip) && tmp[0] != "0" && tmp[0] < 224 && tmp[0] != 127  && tmp[3] != "0" && tmp[3] != "255";
	},
	checkIpv6AllowEmpty: function(ip){
		if(!ip && ip == "") return true
		var ipv6Regex1 = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/; // fd05:bae0:fa6b:0:3b60:878a:be80:d710格式1
		var ipv6Regex2 = /^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/; // fd05:bae0:fa6b::ba7格式2
		if (!ipv6Regex1.test(ip) && !ipv6Regex2.test(ip)) {
			return false;
		}
		var loopbackRegex = /^(?:0*:){7}1$/; // IPv6回环地址
		var multicastRegex = /^ff[0-9a-f]{2}/i; // IPv6组播地址
		if (loopbackRegex.test(ip) || multicastRegex.test(ip)) {
			return false;
		}
		return true;
	},
	checkIpv4v6_url: function(val){
		if(!val && val == "") return true
		var flag1 = true,flag2 = true,flag3 = true
		var ipv4 = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
		if (ipv4.test(val)) {
			var tmp = val.split('.');
			for (var i = 0; i < tmp.length; i++) {
				if (tmp[i].length > 1 && tmp[i][0] == '0') {
					flag1 = false
				}
			}
		}
		if(!(ipv4.test(val) && tmp[0] != "0" && tmp[0] < 224 && tmp[0] != 127  && tmp[3] != "0" && tmp[3] != "255")) flag1 = false

		var urlRegex = /^(https?:\/\/)?([A-Za-z0-9_-]+\.)+[A-Za-z]{2,6}([:0-9]+)?(\/\S*)?$/i;
		if(!urlRegex.test(val)) flag2 = false

		var ipv6Regex1 = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/; // fd05:bae0:fa6b:0:3b60:878a:be80:d710格式1
		var ipv6Regex2 = /^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/; // fd05:bae0:fa6b::ba7格式2
		if (!ipv6Regex1.test(val) && !ipv6Regex2.test(val)) {
			flag3 = false
		}
		var loopbackRegex = /^(?:0*:){7}1$/; // IPv6回环地址
		var multicastRegex = /^ff[0-9a-f]{2}/i; // IPv6组播地址
		if (loopbackRegex.test(val) || multicastRegex.test(val)) {
			flag3 = false
		}
		return flag1 || flag2 || flag3
	},
	checkDomain: function(val){
		if(!val && val=='') return true
		var urlRegex = /^(https?:\/\/)?([A-Za-z0-9_-]+\.)+[A-Za-z]{2,6}([:0-9]+)?(\/\S*)?$/i;
  		return urlRegex.test(val);
	}
};

var CookieUtil = {
	getCookie: function (name) {
		var str = document.cookie;
		if (!str || str.indexOf(name + '=') < 0) {
			return;
		}
		var cookies = str.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].trim();
			if (cookie.indexOf(name + '=') == 0) {
				return decodeURI(cookie.substring(name.length + 1));
			}
		}
	},
	setCookie: function (name, value, option) {
		var str = String.format("{0}={1}", name, encodeURI(value));

		if (option) {
			if (option.expireHours) {
				var date = new Date();
				date.setTime(date.getTime() + option.expireHours * 3600 * 1000);
				str += String.format("; expires={0}", date.toGMTString());
			}
			if (option.path) {
				str += String.format("; path={0}", option.path);
			}
			if (option.domain) {
				str += String.format("; domain={0}", option.domain);
			}
			if (option.secure) {
				str += '; true';
			}
		}

		document.cookie = str;
	},
	deleteCookie: function (name, option) {
		this.setCookie(name, '', option);
	}
};

var DivUtil = {
	showDiv: function ($id) {
		$id.width(document.documentElement.clientWidth);
		$id.height(document.documentElement.clientHeight);
		$id.show();
	},
	clearDiv: function ($id) {
		$id.html("");
		$id.hide();
	},
	moveEvent: function (e, $id) {
		var isIE = (document.all) ? true : false;
		var drag = true;
		var xPoint = isIE ? event.x : e.pageX;
		var yPoint = isIE ? event.y : e.pageY;
		offLeft = $id.offset().left;
		offTop = $id.offset().top;

		$(document).mousemove(function (e) {
			if (drag) {
				var x = isIE ? event.x : e.pageX;
				if (x < 200) {
					x = 200;
				}
				if (x > document.documentElement.clientWidth) {
					x = document.documentElement.clientWidth;
				}
				var y = isIE ? event.y : e.pageY;
				if (y < 100) {
					y = 100;
				}
				if (y > document.documentElement.clientHeight) {
					y = document.documentElement.clientHeight;
				}
				$id.css({
					'top': offTop - yPoint + y - 100 + 'px',
					'left': offLeft - xPoint + x - 200 + 'px'
				});
			}
		});
		$(document).mouseup(function () {
			drag = false;
		});
	}
};

var StatusUtil = {
	formatSingalLevel: function (signalLevel, preCss, content) {
		var ddl = DOC.ddl;
		var signals = [ddl.signalLevelNone, ddl.signalLevel0, ddl.signalLevel1, ddl.signalLevel2, ddl.signalLevel3, ddl.signalLevel4, ddl.signalLevel5];
		var theSignalLevel = parseInt(signalLevel, 10);
		if (isNaN(theSignalLevel) || theSignalLevel > 5 || theSignalLevel < 0 || theSignalLevel == 0) {
			theSignalLevel = -1;
		}
		if (theSignalLevel == -1 && !!preCss) {
			theSignalLevel = 0
		}
		var title = DOC.lte.signalLevel + DOC.colon + signals[theSignalLevel + 1];

		return String.format("<div style='white-space:nowrap' class=\"singal singal{0}\" title=\"{1}\">{2}</div>", theSignalLevel + 1, title, content || "");
	},
	formatAtAssert: function (assert, modem_at) {
		var assertImg = "",
			title = "";
		if (assert == "1" || modem_at == "1") {
			assertImg = "invalid";
			title = PROMPT.status.abnormal;
		} else {
			assertImg = "normal";
			title = PROMPT.status.normal;
		}
		return String.format("<div class=\"{0}\" title=\"{1}\">{2}</div>", assertImg, title, "AT");
	},
	formatSimInfo: function (state, type, lock_plmn_flag) {
		var theState = parseInt(state, 10);
		var title, css, codeType;
		if (type == "1") {
			codeType = PROMPT.status.innerSIM;
		} else {
			codeType = "SIM"
		}
		$('#simInfo').show();
		if (theState == 0) {
			css = "invalid";
			if(lock_plmn_flag != '1'){
				title = DOC.status.noSim;
			}else{
				title=''
			}
		} else if (theState == 1) {
			css = "normal";
			title = DOC.status.existSim;
		} else {
			css = "invalid";
			title = DOC.status.noSim;
			$('#simInfo').hide();
		}

		return String.format("<div class=\"{0}\" title=\"{1}\">{2}</div>", css, title, codeType);
	},
	formatWiFiInfo: function (state) {
		var title, css;
		//alet(state);
		if (state == "0") {
			css = "unnormal";
			title = DOC.status.disabled;
		} else if (state == "part") {
			css = "partnormal";
			title = DOC.status.wifiPartEnabled;
		} else {
			if(Page.build_type) css = "partnormal";
			else css = "normal";
			title = DOC.status.enabled;
    }
		return String.format("<div class=\"{0}\" title=\"{1}\">2.4G Wi-Fi</div>", css, title);
  },

	format5gWiFiInfo: function (state) {
		var title, css;
		//alet(state);
		if (state == "0") {
			css = "unnormal";
			title = DOC.status.disabled;
		} else if (state == "part") {
			css = "partnormal";
			title = DOC.status.wifiPartEnabled;
		} else {
			if(Page.build_type) css = "partnormal";
			else css = "normal";
			title = DOC.status.enabled;
    }
		return String.format("<div class=\"{0}\" title=\"{1}\">5G Wi-Fi</div>", css, title);
	},
	format6gWiFiInfo: function (state) {
		var title, css;
		//alet(state);
		if (state == "0") {
			css = "unnormal";
			title = DOC.status.disabled;
		} else if (state == "part") {
			css = "partnormal";
			title = DOC.status.wifiPartEnabled;
		} else {
			if(Page.build_type) css = "partnormal";
			else css = "normal";
			title = DOC.status.enabled;
    }
		return String.format("<div class=\"{0}\" title=\"{1}\">6G Wi-Fi</div>", css, title);
	},
	//顶部 WAN 图标
	formatLanWanInfo: function (lbl,wanIndex) {
    Page.wanIndex = -1
		var toLower = lbl.toLowerCase();
		if (toLower == "lan4/wan" && Page.networkMode != "2" && Page.networkMode != "5") {
			toLower = "lan4";
		} else if ((Page.networkMode == "2" || Page.networkMode == "5") && (lbl == ("LAN"+wanIndex) || toLower == "lan4/wan")) {
      Page.wanIndex = Number(lbl.match(/\d+/)[0])
			toLower = "wan1";
			lbl = "WAN"
		}
		var $id = "#" + toLower;
		var title, css;
		$($id).show();
		css = "link";
		title = DOC.status.connected;
		$($id).html(String.format("<div class=\"{0}\" title=\"{1}\">{2}</div>", css, title, lbl));
		// return ;
	},
	hasNewSmsPrompt: false,
	smsIntervalId: null,
	setSmsInfo: function (state) {
		var theState = parseInt(state, 10);
		var title, css;
		if (theState == 1) {
			css = "newsms";
			title = DOC.status.newMessage;
		} else {
			css = "normal";
			title = DOC.status.message;
		}

		function setHtml() {
			$('#smsInfo').html(String.format("<div class=\"{0}\" title=\"{1}\">{1}</div>", css, title));
		}

		function clearSmsInterval() {
			if (StatusUtil.smsIntervalId != null)
				clearInterval(StatusUtil.smsIntervalId);
		}

		if (theState == 1) {
			// 新消息是否已经提示
			if (!StatusUtil.hasNewSmsPrompt) {
				StatusUtil.hasNewSmsPrompt = true;

				var count = 0;
				StatusUtil.smsIntervalId = setInterval(function () {
					css = (count % 2 == 0) ? "newsms" : "newsms2";
					setHtml();
					if (count > 10) {
						clearSmsInterval();
					}
					count++;
				}, 500);
			}
		} else {
			StatusUtil.hasNewSmsPrompt = false;
			clearSmsInterval();
			setHtml();
		}
	},
	getSysStatus_timer: null,
	getSysStatus: function () {
		var sysStatus = null;
		function loop() {
			Page.postJSON({
				json: {
					cmd: RequestCmd.GET_SYS_STATUS,
					method: JSONMethod.GET,
					sessionId: ""
				},
				success: function (data) {
					sysStatus = data;
				},
				complete: function () {
					var wifi2gState, wifi5gState, wifi6gState;
					var netInfo;
					if (!!sysStatus.signal_lvl) {
						if(Page.aeraId == "JO0543")
						{
							sysStatus.network_type_str=sysStatus.network_type_str.split("(")[0]
						}
						netInfo = StatusUtil.formatSingalLevel(sysStatus.signal_lvl, sysStatus.network_type_str, sysStatus.network_type_str);
					}
					sessionStorage["signal_lvl"] = parseInt(sysStatus.signal_lvl) || 0;
					sessionStorage["sim_info"] = sysStatus.sim_status == "1" ? 1 : 0;
					sessionStorage["flowLimitFlag"] = sysStatus.flowLimitFlag == '1' ? DOC.lbl.flowLimit : '';
					if (sysStatus.flag == "ok") {
						$("#isShowRefresh").show();
					} else {
						$("#isShowRefresh").hide();
					}
					if (Page.networkMode != '2') {
						$('#netInfo').show();
						$('#netInfo').html(netInfo);
					}
					$('#simInfo').html(StatusUtil.formatSimInfo(sysStatus.sim_status, sysStatus.current_card_type));
					if(Page.isPUK == '1' && Page.pinStatus == '0'){
						$("#simRemind").show();
						$("#simRemind").html(PROMPT.status.error504);
					}else if (sysStatus.ip_status == "1") {
						$("#simRemind").show();
						$("#simRemind").html(CHECK.tip.wiredNetFail);
					}else if (sysStatus.lock_device_flag == "1") {
						$('#simInfo').html(StatusUtil.formatSimInfo(0, sysStatus.current_card_type));
						$("#simRemind").show();
						$("#simRemind").html(PROMPT.status.simRemindDevice);
					} else if (sysStatus.lock_plmn_flag == "1") {
						$('#simInfo').html(StatusUtil.formatSimInfo(0, sysStatus.current_card_type, sysStatus.lock_plmn_flag));
						$("#simRemind").show();
						$("#simRemind").html(PROMPT.status.simRemindPlmn);
					} else if (sysStatus.ipClash == "1") {
						$("#simRemind").show();
						$("#simRemind").html(PROMPT.status.ipClash);
					} else if (sysStatus.roam_status == "1") {
						var txt = sysStatus.roamingEnable == "1" ? PROMPT.status.simRemindRoam : PROMPT.status.simRemindRoam2;
						$("#simRemind").show();
						$("#simRemind").html(txt);
					} else {
						//PCI 锁定
            if(Page.aeraId == 'AE0001' && Page.level == "2" && sysStatus.pci_arrears_enable == '1'){
							$("#simRemind").show();
							$("#simRemind").html(DOC.lbl.theCpeIsSuspended);
            } else if(Page.level == "2" && sysStatus.pci_manual_enable == '1'){
							$("#simRemind").show();
							$("#simRemind").html(DOC.lbl.ecgiWarning_1);
						}else if (((Page.aeraId == 'AE0001' &&Page.level == "2") || Page.aeraId != 'AE0001') && sysStatus.pci_enable == '1') {
							$("#simRemind").show();
							$("#simRemind").html(DOC.lbl.ecgiWarning);
						} else {
							$("#simRemind").hide();
						}
					}


					if (sysStatus.wlan2g_switch == "1") {
						if (sysStatus.wlan2g_switch_0 == "1" && sysStatus.wifiDown != "1") {
							wifi2gState = "1";
						} else {
							wifi2gState = "0";
						}
					} else {
						wifi2gState = "0";
					}
					if (sysStatus.wlan5g_switch == "1") {
						if (sysStatus.wlan5g_switch_0 == "1" && sysStatus.wifiDown != "1") {
							wifi5gState = "1";
						} else {
							wifi5gState = "0";
						}
					} else {
						wifi5gState = "0";
					}
					if (sysStatus.wlan6g_switch == "1") {
						if (sysStatus.wlan6g_switch_0 == "1" && sysStatus.wifiDown != "1") {
							wifi6gState = "1";
						} else {
							wifi6gState = "0";
						}
					} else {
						wifi6gState = "0";
					}
					var wiredLinkList = sysStatus.wired_link_list;
					if (wiredLinkList) {
						$("#lan1").hide();
						$("#lan2").hide();
						$("#lan3").hide();
						$("#lan4").hide();
						var wanIndex = sysStatus.wanIndex || 3
						for (var i = 0; i < wiredLinkList.length; i++) {
							StatusUtil.formatLanWanInfo(wiredLinkList[i],(+wanIndex)+1);
						}
					}
					$('#wifiInfo').html(StatusUtil.formatWiFiInfo(wifi2gState));
					$('#wifiInfo5g').html(StatusUtil.format5gWiFiInfo(wifi5gState));
          if (Page.supportsFeature(112)) {
            $('#wifiInfo6g').show();
            $('#wifiInfo6g').html(StatusUtil.format6gWiFiInfo(wifi6gState));
          }
					$("#lteUsbInfo").html(StatusUtil.formatAtAssert(sysStatus.modem_assert, sysStatus.modem_at));

					// 飞行模式状态判断
					if(sysStatus.flightMode == '1'){
						$('#flightMode').show()
						$('#netInfo').hide()
					}else{
						$('#flightMode').hide()
						$('#netInfo').show()
					}

					// 数据连接状态判断
					var css, title;
					if (sysStatus.network_status == '1') {
						if (sysStatus.wanMode === '5' || sysStatus.wanMode === '7') {
							if (sysStatus.wanPrio === '1' || sysStatus.wanPrio === '0') {
								css = sysStatus.wanPrio === '1' ? 'wireConn' : 'mobileConn';
								title = sysStatus.wanPrio === '1' ? DOC.lbl.dataWireOpen : DOC.lbl.dataMobileOpen;
							} else if (sysStatus.wanStrategy === '1' || sysStatus.wanStrategy === '0') {
								css = sysStatus.wanStrategy === '1' ? 'wireConn' : 'mobileConn';
								title = sysStatus.wanStrategy === '1' ? DOC.lbl.dataWireOpen : DOC.lbl.dataMobileOpen;
							} else {
								css = sysStatus.wanMode === '7' ? 'wireConn' : 'mobileConn';
								title = sysStatus.wanMode === '7' ? DOC.lbl.dataWireOpen : DOC.lbl.dataMobileOpen;
							}
						} else if(sysStatus.wanMode === '2'){
							css = 'wireConn'
							title = DOC.lbl.dataWireOpen;
						}else{
							css = 'mobileConn';
							title = DOC.lbl.dataSwitchOpen;
						}
					} else {
						css = 'mobileDisconn';
						title = DOC.lbl.dataSwitchClose;
					}
					$("#dataSwitch").html(String.format('<div class="{0}" title="{1}"></div>', css, title));
					$("#dataSwitch").show();
					// 数据状态结束
					if (Page.aeraId === "TN0303") {
            if (sysStatus.voice_type == '0') {
              if (sysStatus.volteStatus == '4') {
                $("#voiceActive").show();
                $("#voiceInactive").hide();
              } else {
                $("#voiceActive").hide();
                $("#voiceInactive").show();
              }
              $('#voiceInfo').text('VoLTE');
            } else if (sysStatus.voice_type == '1') {
              if (sysStatus.voipStatus == '3') {
                $("#voiceActive").show();
                $("#voiceInactive").hide();
              } else {
                $("#voiceActive").hide();
                $("#voiceInactive").show();
              }
              $('#voiceInfo').text('VoIP');
            } else if (sysStatus.voice_auto_sw == "1") {
              if (sysStatus.volteStatus == '4') {
                $("#voiceActive").show();
                $("#voiceInactive").hide();
                $('#voiceInfo').text('VoLTE');
              } else if (sysStatus.voipStatus == '3') {
                $("#voiceActive").show();
                $("#voiceInactive").hide();
                $('#voiceInfo').text('VoIP');
              } else {
                $("#voice").hide();
              }
            } else {
              $("#voice").hide();
            }
          } else {
            if (sysStatus.voice_type == '0' && sysStatus.volteStatus == '4') {
              $('#oldVoiceInfo').text('HD');
            } else if (sysStatus.voice_type == '1' && sysStatus.voipStatus == '3') {
              $('#oldVoiceInfo').text('VoIP');
            } else if (sysStatus.voice_auto_sw == "1") {
              sysStatus.volteStatus == '4' && $('#oldVoiceInfo').text('HD');
              sysStatus.voipStatus == '3' && $('#oldVoiceInfo').text('VoIP');
            } else {
              $('#oldVoiceInfo').text('');
            }
          }
				}
			});
		}

		loop();
		clearInterval(StatusUtil.getSysStatus_timer)
		StatusUtil.getSysStatus_timer = setInterval(() => {
			loop();
		},10000);
	}
};

function getOpenInfo() {
	// if (!IsPC()) {
	// 	vant.Dialog.confirm({
	// 		message: PROMPT.confirm.deviceInfo,
	// 		confirmButtonText: DOC.btn.confirm,
	// 		cancelButtonText: PROMPT.tips.cancel
	// 	})
	// 		.then(function () {
	// 			window.location.href = Page.getUrl("/mobile_web/login.html");
	// 		})
	// 		.catch(function () {
	// 			return
	// 		});

	// }
	var loading = '-';
	var theRouterInfo = {},
		theLteInfo = {};
	Page.isNULLToSpace = true;

	function createTable(routerInfo, lteInfo, noRefresh) {
		var supportedLte = true;
		var lte_info_id = '#lte_info';
		var wan_info_id = supportedLte ? '#wan_info' : '#wan_info2';
		var names = [],
			values = [];
		var lteNames = DOC.lte,
			netNames = DOC.net;
		var html;
		names.push(lteNames.rsrp);
		names.push(lteNames.rssi);
		names.push(lteNames.rsrq);
		names.push(lteNames.sinr);
		names.push(lteNames.phyCellId);
		names.push(lteNames.freqPoint);

		values.push((routerInfo.RSRP ? (routerInfo.RSRP + 'dBm') : loading) + "/" + (routerInfo.RSRP_5G ? (routerInfo.RSRP_5G + 'dBm') : loading));
		values.push((routerInfo.RSSI ? FormatUtil.formatField(routerInfo.RSSI, 'dBm') : loading) + "/" + (routerInfo.RSSI_5G ? FormatUtil.formatField(routerInfo.RSSI_5G, 'dBm') : loading));
		values.push((routerInfo.RSRQ ? (routerInfo.RSRQ + 'dB') : loading) + "/" + (routerInfo.RSRQ_5G ? (routerInfo.RSRQ_5G + 'dB') : loading));
		values.push((routerInfo.SINR && routerInfo.SINR != "-" ? (routerInfo.SINR + 'dB') : loading) + "/" + (routerInfo.SINR_5G ? (routerInfo.SINR_5G + 'dB') : loading));
		values.push((routerInfo.PCI || loading) + "/" + (routerInfo.PCI_5G || loading));
		values.push((routerInfo.FREQ ? routerInfo.FREQ : loading) + "/" + (routerInfo.FREQ_5G ? routerInfo.FREQ_5G : loading));

		html = Page.createTable(DOC.title.lteInfoBasic, names, values, names.length, 1, "detail2");
		$('#device_check').show();
		$(lte_info_id).html(html);
		Page.setStripeTable(lte_info_id);

		var names_route = [];
		names_route.push(DOC.lbl.runtime);
		names_route.push(DOC.device.firmwareVersion);
		if(Page.isDebugVersion) names_route.push(DOC.device.domain_value);


		var values_route = [];
		if (routerInfo.uptime) {
			values_route.push(ConvertUtil.parseUptime2(routerInfo.uptime) || loading);
		} else {
			values_route.push(loading);
		}
		if (routerInfo.fake_version) {
			if (sessionStorage["theme"] == "mobot.css") {
				values_route.push(FormatUtil.formatField("M" + routerInfo.fake_version) || loading);
			} else {
				values_route.push(FormatUtil.formatField(routerInfo.fake_version) || loading);
			}
		} else {
			values_route.push(FormatUtil.formatField(loading));
		}
		if(Page.isDebugVersion) values_route.push(Page.domain_value);
		sessionStorage["fake_version"] = routerInfo.fake_version || "1.0.0";
		sessionStorage["real_fwversion"] = routerInfo.real_fwversion || "1.0.0";

		html = Page.createTable(DOC.title.router, names_route, values_route, names_route.length, 1, "detail2");
		$('#router_info').html(html);
		Page.setStripeTable('#router_info');


		var names_wan = [];
		names_wan.push(netNames.ip);
		names_wan.push(DOC.device.wanMac);
		names_wan.push(netNames.dns1);
		names_wan.push(netNames.dns2);
		names_wan.push(netNames.ipv6);
		names_wan.push(netNames.dns3);
		names_wan.push(netNames.dns4);

		var values_wan = [];
		values_wan.push(FormatUtil.formatField(routerInfo.wan_ip || loading));
		values_wan.push(FormatUtil.formatField((routerInfo.wan_mac && routerInfo.wan_mac.toUpperCase()) || loading));
		values_wan.push(FormatUtil.formatField(routerInfo.wan_dns || loading));
		values_wan.push(FormatUtil.formatField(routerInfo.wan_dns2 || loading));
		values_wan.push(FormatUtil.formatField(routerInfo.wan_ipv6_ip || loading));
		values_wan.push(FormatUtil.formatField(routerInfo.wan_ipv6_dns || loading));
		values_wan.push(FormatUtil.formatField(routerInfo.wan_ipv6_dns2 || loading));

		var names_wan2 = [];
		names_wan2.push(DOC.net.ip);
		names_wan2.push(DOC.net.mask);
		names_wan2.push(DOC.lan.gateway);
		names_wan2.push(DOC.device.wanMac);
		names_wan2.push(DOC.net.dns1);
		names_wan2.push(DOC.net.dns2);

		var values_wan2 = [];
		values_wan2.push(FormatUtil.formatField(routerInfo.wired_wan_ip || loading));
		values_wan2.push(FormatUtil.formatField(routerInfo.wired_wan_netmask || loading));
		values_wan2.push(FormatUtil.formatField(routerInfo.wired_wan_gateway || loading));
		values_wan2.push(FormatUtil.formatField((routerInfo.wired_wan_mac && routerInfo.wired_wan_mac.toUpperCase()) || loading));
		values_wan2.push(FormatUtil.formatField(routerInfo.wired_wan_dns || loading));
		values_wan2.push(FormatUtil.formatField(routerInfo.wired_wan_dns2 || loading));

		var names_wan3 = [];
		names_wan3.push(DOC.net.ip);
		names_wan3.push(DOC.net.mask);
		names_wan3.push(DOC.lan.gateway);
		names_wan3.push(DOC.device.wanMac);
		names_wan3.push(DOC.net.dns1);
		names_wan3.push(DOC.net.dns2);

		var values_wan3 = [];
		values_wan3.push(FormatUtil.formatField(routerInfo.wlan_wan_ip || loading));
		values_wan3.push(FormatUtil.formatField(routerInfo.wlan_wan_netmask || loading));
		values_wan3.push(FormatUtil.formatField(routerInfo.wlan_wan_gateway || loading));
		values_wan3.push(FormatUtil.formatField((routerInfo.wlan_wan_mac && routerInfo.wlan_wan_mac.toUpperCase()) || loading));
		values_wan3.push(FormatUtil.formatField(routerInfo.wlan_wan_dns || loading));
		values_wan3.push(FormatUtil.formatField(routerInfo.wlan_wan_dns2 || loading));

		if (Page.networkMode == '2' || (Page.networkMode == '5' && Page.priorityStrategy == '1')) {
			//移动
			html = Page.createTable(DOC.title.wiredWan, names_wan2, values_wan2, names_wan2.length, 1, "detail2");
		} else if (Page.networkMode == '3' || Page.networkMode == '4') {
			html = Page.createTable(Page.networkMode == '3' ? DOC.title.wlan2g : DOC.title.wlan5g, names_wan3, values_wan3, names_wan3.length, 1, "detail2");
		} else {
			html = Page.createTable(DOC.title.wan, names_wan, values_wan, names_wan.length, 1, "detail2"); //WAN
		}
		$(wan_info_id).html(html);
		Page.setStripeTable(wan_info_id);
		setTimeout(getRouterInfo, 10000);
	}

	var SEPARATOR = '$',
		FIELD_SEPARATOR = '@',
		SYSTEM_MODE = 'System Mode',
		OPERATION_MODE = 'Operation Mode',
		PLMN = 'MCC MNC',
		LAC_TAC = 'TAC/LAC',
		SERVING_CELLID = 'Serving CellID',
		PHYSICAL_CELLID = 'Physical CellID',
		CURRENT_BAND = 'Frequency Band',
		EARFCN = 'EARFCN/ARFCN',
		DOWNLINK_BANDWIDTH = 'Downlink Bandwidth',
		UPLINK_BANDWIDTH = 'Uplink Bandwidth',
		RSRQ = 'RSRQ',
		RSRP = 'RSRP',
		RSRP2 = 'RSRP2',
		RSSI = 'RSSI',
		RSSI2 = 'RSSI2',
		SINR = 'SINR',
		SINR2 = 'SINR2',
		TZTRANSMODE = 'TZTRANSMODE',
		TZTA = 'TZTA',
		TZTXPOWER = 'TZTXPOWER';

	function getLteInfo(routerInfo) {
		Page.isOpenPage = true;
		Page.getHtml(MenuItem.CLIENT_LIST.url, MenuItem.CLIENT_LIST.cmd, function (data) {
			$('#client_info_hidden').html(data);
		});

		Page.postJSON({
			json: {
				method: JSONMethod.POST,
				cmd: RequestCmd.GET_LTE_STATUS
			},
			success: function (data) {
				var lteInfo = {};
				var phyCellId = '';
				var items = data.message.split(SEPARATOR);
				for (var i = 0; i < items.length; i++) {
					var item = items[i].split(FIELD_SEPARATOR);
					if (item.length == 2) {
						switch (item[0]) {
							case EARFCN:
								lteInfo.freq = item[1];
								break;
							case CURRENT_BAND:
								lteInfo.band = item[1];
								break;
							case RSRP:
								lteInfo.rsrp = item[1];
								break;
							case RSRP2:
								lteInfo.rsrp2 = item[1];
								break;
							case RSRQ:
								lteInfo.rsrq = item[1];
								break;
							case SINR:
								lteInfo.sinr = item[1];
								break;
							case SINR2:
								lteInfo.sinr2 = item[1];
								break;
							case RSSI:
								lteInfo.rssi = item[1];
								break;
							case RSSI2:
								lteInfo.rssi2 = item[1];
								break;

							case SERVING_CELLID:
								phyCellId = parseInt(item[1], 10);
								if (!isNaN(phyCellId)) {
									lteInfo.globalCellId = phyCellId.toString(16).toUpperCase();
									Page.cellId = phyCellId % 256;
									Page.enodeId = (phyCellId - Page.cellId) / 256;

									lteInfo.enodeBId = String.format('{0}/{1}', Page.enodeId, Page.cellId);
								} else {
									lteInfo.globalCellId = phyCellId;
									lteInfo.enodeBId = phyCellId;
								}
								break;

							case PHYSICAL_CELLID:
								lteInfo.phyCellId = item[1];
								break;

							case DOWNLINK_BANDWIDTH:
								lteInfo.bandWidth = item[1];
								break;
							case TZTRANSMODE:
								lteInfo.tm = item[1];
								break;
							case TZTA:
								lteInfo.tzta = item[1];
								break;
							case TZTXPOWER:
								lteInfo.txpower = item[1];
								break;

							default:
								break;
						}
					}
				}

				theLteInfo = lteInfo;
				createTable(routerInfo, lteInfo);
			},
			fail: function () {
				createTable(routerInfo, theLteInfo);
			},
			error: function () {
				createTable(routerInfo, theLteInfo);
			}
		});
	}

	function getRouterInfo() {
		Page.postJSON({
			json: {
				cmd: RequestCmd.ROUTER_INFO
			},
			success: function (routerInfo) {
				// save
				theRouterInfo = routerInfo;
				// getLteInfo(routerInfo);
				createTable(routerInfo, theLteInfo, true);
			},
			fail: function () {
				getLteInfo(theRouterInfo);
			},
			error: function () {
				getLteInfo(theRouterInfo);
			}
		});
	}

	getRouterInfo();
	createTable(theRouterInfo, theLteInfo, true);
};

function MenuHead(css, text, bodys) {
	this.css = css;
	this.text = text;
	this.bodys = [];
}

MenuHead.prototype.push = function (body, itemHide, itemSupported, supportFlag) {
	this.bodys.push(body);
}

function MenuBody(id, text) {
	this.id = id;
	this.text = text;
}

var MenuUtil = {
	create: function (menus) {
		var sb = new StringBuilder();
		var menu, body, bodys;
		for (var i = 0, length = menus.length; i < length; i++) {
			menu = menus[i];
			sb.append(String.format('<h3 class="{0}">{1}</h3>', menu.css, menu.text));
			sb.append(String.format('<ul class="{0}">', menu.css));

			bodys = menu.bodys;
			for (var j = 0, max = bodys.length; j < max; j++) {
				body = bodys[j];
				sb.append(String.format('<li><a id="{0}">{1}</a></li>', body.id, body.text));
			}
			sb.append('</ul>');
		}
		return sb.toString();
	}
};

function secondMenuClick(items, id) {
	$('#detail_container').pannel({
		items: items,
		id: id,
		init: function ($lis) {
			var hashArr = window.location.hash.split("#");
			_clearInterval();
			if (hashArr.length > 2 && id == hashArr[1]) {
				$lis.eq(hashArr[2]).click();
			} else {
				$lis.eq(0).click();
			}
		}
	});
}

function resetTime() {
	Page.postJSON({
		json: {
			cmd: RequestCmd.RESET_LOGIN_TIME,
			method: JSONMethod.GET
		},
		success: function (data) {
			sessionStorage["token"] = data.token;
		}
	})
}

function _clearInterval() {
	if (window.TIMEOUT) {
		clearTimeout(window.TIMEOUT);
		window.TIMEOUT = null;
	}
	if (Page.timer) {
		clearInterval(Page.timer);
		Page.timer = null;
	}
}

//dialer 返回错误码来显示对应的文本提示
function errorCodeInfo(code,flag) {
	var txt = "";
	switch (code) {
		case 500:
			txt = PROMPT.status.error500;
			break;
		case 501:
			txt = PROMPT.status.error501;
			break;
		case 502:
			txt = flag==1?PROMPT.status.error502PLNM:PROMPT.status.error502;
			break;
		case 503:
			txt = PROMPT.status.error503;
			break;
		case 504:
			txt = PROMPT.status.error504;
			break;
		case 505:
			txt = PROMPT.status.error505;
			break;
		case 506:
			txt = PROMPT.status.error506;
			break;
		case 507:
			txt = PROMPT.status.error507;
			break;
		default:
			txt = PROMPT.status.errorUnknow;
	}
	return txt;
}
// 添加弹框
// title    :'提示',            //标题
//   icon     : '',
// content  : '',               //内容
// skin     : '',               //皮肤
// position : 'fixed',			//定位方式
// closeBtn : true,   			//是否显示关闭按钮
// type     : 1,      			//type=2 为 iframe
// drag     : false,   			//是否开启拖动
// time     : 2000,   			//当无头或无底部按钮时自动关闭时间
// shadow   : [0.3,'#000'], 	//遮罩
// shadowClose : true,  		//是否点击遮罩关闭
// animateType : 0, 			// 0 为默认动画 1 为底部弹出 2 为顶部弹出 3 为左部弹出 4 为右部弹出
// aniExtend: '',   			//例 css 动画名 opacity
// area     : ['auto','auto'], 	//设置宽高
// minmax   : false,
// direction: ['center','center'], 	//方向 key1:right left center  key2: top bottom center
// btns     : {                   	//按钮组
//    /* '确定' : function(){},*/
// },
// success  : function(){},  //弹出后回调
// end      : function(){}   //关闭后回调

//加载中...
function fyAlertMsgLoading(msg) {
	unFocus();
	var message = "";
	if (msg) {
		message = msg;
	} else {
		message = CHECK.format.waiting;
	}
	fyAlert.alert({
		title: message,
		closeBtn: false,
		animateType: 2,
		shadowClose: false,
		area: ['400px', '150px'],
		direction: ['center', 'center'],
		skin: 'fyAlert-green',
		content: '<div class="el-loading-spinner" style="position: relative;margin-top: 10px"><svg viewBox="25 25 50 50" class="circular" style="height: 50px; width: 50px;"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div>' //$("#contentText"),    //内容
	})
}
//成功
function fyAlertMsgSuccess(msg) {
	fyAlert.destory();
	var message = "";
	if (msg) {
		message = msg;
	} else {
		message = PROMPT.status.success;
	}
	fyAlert.alert({
		title: message,
		closeBtn: false,
		animateType: 0,
		shadowClose: false,
		area: ['400px', 'auto'],
		direction: ['center', 'center'],
		skin: 'fyAlert-green',
		content: '<p style="text-align:center"><i style="font-size: 64px; color: #6abd12;" class="el-icon-circle-check"></i></p>', //$("#contentText"),    //内容
		btns: { //按钮组
      btns: function (obj) { //翻译在 js 里面
				obj.destory(); //在页面上
			}
		}
	})

}
//失败弹框
function fyAlertMsgFail(msg, flag,contentTip) {
	if (!flag) {
		fyAlert.destory();
	}
	var message = "";
	if (msg) {
		message = msg;
	} else {
		message = PROMPT.status.fail;
	}
	if(contentTip == null) contentTip = "";
	fyAlert.alert({
		title: message,
		closeBtn: false,
		animateType: 0,
		shadowClose: false,
		area: ['400px', 'auto'],
		direction: ['center', 'center'],
		skin: 'fyAlert-green',
		content: '<p style="text-align:center;font-size: 12px;font-weight:bold;"><i style="font-size: 64px; color: #ee1919;" class="el-icon-circle-close"></i><br/>'+contentTip+'</p>', //$("#contentText"),    //内容
		btns: { //按钮组
      btns: function (obj) { //翻译在 js 里面
				obj.destory(); //在页面上
			}
		}
	})
}
//确认取消
function fyConfirmMsg2(msg, clearDestory, callback) {
	if (clearDestory) {
		fyAlert.destory();
	}
	fyAlert.alert({
		title: DOC.lbl.prompt,
		closeBtn: false,
		animateType: 0,
		shadowClose: false,
		area: ['400px', 'auto'],
		direction: ['center', 'center'],
		skin: 'fyAlert-green',
		content: msg, //$("#contentText"),    //内容
		btns: { //按钮组
      btns: function (obj) { //翻译在 js 里面
				obj.destory(); //在页面上
				callback && callback()
			}
		}
	})
}

function fyConfirmMsg(msg, callback, callback1) {
	fyAlert.alert({
		title: " ",
		closeBtn: false,
		animateType: 0,
		shadowClose: false,
		area: ['400px', 'auto'],
		direction: ['center', 'center'],
		skin: 'fyAlert-green',
		content: msg, //$("#contentText"),    //内容
		btns: { //按钮组
      btns: function (obj) { //翻译在 js 里面
				obj.destory(); //在页面上
				callback();
			},
      delete: function (obj) { //翻译在 js 里面
				obj.destory(); //在页面上
        callback1 && callback1()
			}
		}
	})
}

//警告
function fyAlertMsgWarn(text, flag) {
	if (flag) {
		fyAlert.destory();
	}
	var content = '<p style="text-align:center;"><img src="../images/warning.png"></p>';
	if (!!text) {
		content = content + '<p style="overflow: hidden;text-align:center;">' + text + '</p>'
	}
	fyAlert.alert({
		title: PROMPT.status.warn,
		closeBtn: false,
		animateType: 0,
		shadowClose: false,
		area: ['400px', 'auto'],
		direction: ['center', 'center'],
		skin: 'fyAlert-green',
		content: content, //$("#contentText"),    //内容
		btns: { //按钮组
      btns: function (obj) { //翻译在 js 里面
				obj.destory(); //在页面上
			}
		}
	})

}

//带文本的等待框
function fyAlertMsgLoadText(text) {
	var content = '<p style="text-align:center;"><img src="../images/loading.gif"></p>';
	if (!!text) {
		content = content + '<p style="overflow: hidden;text-align:center;">' + text + '</p>'
	}
	fyAlert.alert({
		title: CHECK.format.waiting,
		closeBtn: false,
		animateType: 0,
		shadowClose: false,
		area: ['400px', 'auto'],
		direction: ['center', 'center'],
		skin: 'fyAlert-green',
		content: content, //$("#contentText"),    //内容
		btns: { //按钮组
      btns: function (obj) { //翻译在 js 里面
				obj.destory(); //在页面上
			}
		}
	})

}

function fyAlertDestory() {
	fyAlert.destory();
}

function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPad", "iPod"
	];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}
function utf16to8(str) {//wifi 直连二维码
	var out, i, len, c;
	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}
function isHide(bit) {
	return Page.hideNoAccount[bit] == "0";
}
//默認顯示
function isHide2(bit) {
	return Page.hideNoAccount[bit] == "1";
}
function isUtf16(str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测 utf16 字符正则  
	str = str.replace(patt, function (char) {
		var H, L, code;
		if (char.length === 2) {
			H = char.charCodeAt(0).toString(16); // 取出高位  
			L = char.charCodeAt(1).toString(16); // 取出低位  
			bq = (H + L).toUpperCase()
			return (H + L).toUpperCase();
		} else {
			return char;
		}
	});
	return str;
}

function unFocus() {
  // 用于强制失焦 => elementUI bug, 点击按钮后不失焦
  var button = document.createElement('button');
  button.style.position = 'fixed';
  button.style.opacity = 0;
  document.body.appendChild(button);
  button.focus();
  button.remove();
};
// 根据 wlanpage.js 文件的安全选项更改对应帮助信息
function deal_help(optionArry){
	if(optionArry.length>0){
		let tmp =wlan5ghtml.helper.securityHead;
		for(let i=0;i<optionArry.length;i++){
			if(i == (optionArry.length-1)){
				if(optionArry[i].name == "OPEN"){
					tmp = tmp + wlan5ghtml.helper.securityOpen;
				}else{
					tmp = tmp + optionArry[i].name;
				}
			}else{
				if(optionArry[i].name == "OPEN"){
          tmp = tmp + wlan5ghtml.helper.securityOpen + ",";
				}else{
					tmp = tmp + optionArry[i].name + "、";
				}
			}
		}
		return tmp;
	}
}

//定制 ussd 弹窗
function fyAlertMsgWarn2(text, flag) {
	if (!flag) {
		fyAlert.destory();
	}
	var content = '<p style="text-align:left;"><img src="../images/warning.png"></p>';
	if (!!text) {
		content = content + '<p style="text-align:center;">' + text + '</p>'
	}
	fyAlert.alert({
		title: DOC.lbl.notice,
		closeBtn: false,
		animateType: 0,
		shadowClose: false,
		area: ['400px', 'auto'],
		direction: ['center', 'center'],
		skin: 'fyAlert-green',
		content: content, //$("#contentText"),    //内容
		btns: { //按钮组
      btns_ussd: function (obj) { //翻译在 js 里面
        obj.destory(); //在页面上
			}
		}
	})

};
//ele 表单校验 IP
function ipFormat(rule, value, callback){
	var reg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([1-9][0-9]?|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/;
	if(!value) {
		callback();
	} else if(reg.test(value)){
		var arr = value.split('.')
		for(var i = 0;i < 4;i++){
			if(arr[i].length>1 && arr[i][0]=='0'){
				callback(rule.message);
				return;
			}
		}
		if (arr[0] === "0" || arr[0] === "127" || arr[0] >= 224 || arr[3] === "0" || arr[3] === "255") {
			rule.message = CHECK.format.ipRule;
			callback(rule.message);
		} else {
			callback();
		}
	} else {
		callback(rule.message);
	}
};