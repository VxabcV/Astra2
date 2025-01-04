export default function parse(data) {
    try
    {
        /*
            Initiate a new ProtocolXParser with your received data, use the options parameter to change certain behaviour.
        */
        let parser = new ProtocolXParser(
            data, 
            new ProtocolXParserOptions(
                /* 
                    enableMode4: Set this option to true to make the parser check the packet for an IMEI when using $MODE,4. 

                    Enabling this is NOT RECCOMENDED. 
                    You should use your device with $MODE,6 configuration to enable login packets instead of encoding it in the data packets.
                */
                false
            )
        );

        /* 
            By default, devices use $MODE,6 which means they will send a login packet before sending data.
            If the data received is the login packet, isLogin will be 'true' and details about the device
            can be accessed under the parser's loginData property
        */
        if (parser.isLogin)
        {
            console.log(parser.loginData);
            /*
                EXAMPLE OUTPUT:

                ProtocolXLoginData {
                    imei: '860873045366969',
                    model: 'AT402',
                    vin: '',
                    firmwareVersion: '7.0.70.3',
                    hardwareRevision: '1',
                    settingsChecksum: '8A1B'
                }
            */
        }
        else if (parser.packet?.reports)
        {
            /* 
                If your device is using $MODE,4 which means it will not send a login packet,
                the device's IMEI will be available under the packet's mode4Imei property, othwerwise
                it will be undefined.

                Example:
                if (parser.packet.mode4Imei)
                {
                    console.log('device is using $MODE,4, imei: ', parser.packet.mode4Imei);
                }
            */
            parser.packet.reports.forEach((report) => {
                console.log(report);
                /*
                    EXAMPLE OUTPUT:

                    ProtocolXReport {
                        reasons: [
                            ProtocolXReason { index: 7, label: 'JOURNEY_STOP' },
                            ProtocolXReason { index: 29, label: 'ENTERING_SLEEP_MODE' }
                        ],
                        sequenceNumber: 204,
                        timestamp: 2024-06-25T22:02:04.000Z,
                        statusFlags: 72,
                        status: ProtocolXReportStatus {
                            ignitionState: false,
                            businessMode: true,
                            gpsValid: true,
                            networkRoaming: false,
                            reportsToFollow: false,
                            storedReport: false,
                            immobilised: false,
                            rs232ExternalDeviceReadError: false,
                            gpsJammerDetected: false,
                            luggageCompartmentUnlocked: true,
                            backupBatteryCharging: false
                        },
                        devicePower: ProtocolXDevicePower { externalVoltageV: 0, batteryLevelPercent: 85 },
                        gpsData: ProtocolXGpsData {
                            latitude: 53.471953,
                            longitude: -2.260216,
                            speedKph: 4,
                            maxSpeedSinceLastReportKph: 22,
                            journeyDistanceKm: 8.6,
                            headingDeg: 172,
                            altitudeM: 0
                        },
                        digitals: ProtocolXDigitals {
                            inState: [Function (anonymous)],
                            outState: [Function (anonymous)],
                            inChanged: [Function (anonymous)],
                            outChanged: [Function (anonymous)],
                            applyMasks: [Function (anonymous)],
                            statesMask: 512,
                            changesMask: 0,
                            digin1_state: 0,
                            digin2_state: 0,
                            digin3_state: 0,
                            digin4_state: 0,
                            digin5_state: 0,
                            digin6_state: 0,
                            digin7_state: 0,
                            digin8_state: 0,
                            digout1_state: 0,
                            digout2_state: 1,
                            digout3_state: 0,
                            digout4_state: 0,
                            digout5_state: 0,
                            digout6_state: 0,
                            digout7_state: 0,
                            digout8_state: 0,
                            digin1_changed: false,
                            digin2_changed: false,
                            digin3_changed: false,
                            digin4_changed: false,
                            digin5_changed: false,
                            digin6_changed: false,
                            digin7_changed: false,
                            digin8_changed: false,
                            digout1_changed: false,
                            digout2_changed: false,
                            digout3_changed: false,
                            digout4_changed: false,
                            digout5_changed: false,
                            digout6_changed: false,
                            digout7_changed: false,
                            digout8_changed: false
                        },
                        driverBehaviour: ProtocolXDriverBehaviour {
                            accelXMaxMss: 8.5,
                            accelXMinMss: 4.4,
                            accelYMaxMss: 3.1,
                            accelYMinMss: 3.3,
                            accelZMaxMss: 5.3,
                            accelZMinMss: 0.3,
                            idleTimeS: 2961
                        },
                        signalQuality: ProtocolXSignalQuality {
                            gnssSatellitesInUse: 5,
                            gsmSignalStrength: -59
                        },
                        gnssStopReportData: ProtocolXGnssStopReportData {
                            lifetimeOdometerKm: 9,
                            engineRunningHours: 31
                        }
                        }
                */
            });

            // easily serialize a packet for storage or forwarding
            console.log(JSON.stringify(parser.packet));
            /*
                EXAMPLE OUTPUT:

                {"reports":[{"reasons":[{"index":5,"label":"EXTERNAL_IO"},{"index":10,"label":"EXTERNAL_POWER"},{"index":29,"label":"ENTERING_SLEEP_MODE"}],"sequenceNumber":210,"timestamp":"2024-06-25T22:08:38.000Z","statusFlags":72,"status":{"ignitionState":false,"businessMode":true,"gpsValid":true,"networkRoaming":false,"reportsToFollow":false,"storedReport":false,"immobilised":false,"rs232ExternalDeviceReadError":false,"gpsJammerDetected":false,"luggageCompartmentUnlocked":true,"backupBatteryCharging":false},"devicePower":{"externalVoltageV":0.2,"batteryLevelPercent":95},"gpsData":{"latitude":53.472127,"longitude":-2.259839,"speedKph":0,"maxSpeedSinceLastReportKph":0,"journeyDistanceKm":0,"headingDeg":322,"altitudeM":0},"digitals":{"statesMask":512,"changesMask":0,"digin1_state":0,"digin2_state":0,"digin3_state":0,"digin4_state":0,"digin5_state":0,"digin6_state":0,"digin7_state":0,"digin8_state":0,"digout1_state":0,"digout2_state":1,"digout3_state":0,"digout4_state":0,"digout5_state":0,"digout6_state":0,"digout7_state":0,"digout8_state":0,"digin1_changed":false,"digin2_changed":false,"digin3_changed":false,"digin4_changed":false,"digin5_changed":false,"digin6_changed":false,"digin7_changed":false,"digin8_changed":false,"digout1_changed":false,"digout2_changed":false,"digout3_changed":false,"digout4_changed":false,"digout5_changed":false,"digout6_changed":false,"digout7_changed":false,"digout8_changed":false},"signalQuality":{"gnssSatellitesInUse":4,"gsmSignalStrength":-59}}],"length":48}
            */
        }
    }
    catch (e)
    {
        console.log('error parsing: ',e);
    }
}
