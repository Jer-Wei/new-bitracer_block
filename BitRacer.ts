//
const N76_ADDR = 0x10
//% weight=0 color=#f98020 icon="\uf1b0" block="BitRacer_New"
namespace BitRacer {
    export enum Motors {
        //% blockId="left motor" block="left"
        M_R = 0,
        //% blockId="right motor" block="right"
        M_L = 1,
        //% blockId="all motor" block="all"
        All = 2
    }
    export enum IR_Sensors {
        //% blockId="IR1_Sensors" block="IR1"
        IR1 = 0x03,
        //% blockId="IR2_Sensors" block="IR2"
        IR2 = 0x04,
        //% blockId="IR3_Sensors" block="IR3"
        IR3 = 0x05,
        //% blockId="IR4_Sensors" block="IR4"
        IR4 = 0x06,
        //% blockId="IR5_Sensors" block="IR5"
        IR5 = 0x07
    }	
	export enum LineColor {
        //% blockId="White" block="White"
        White = 0x0A,
        //% blockId="Black" block="Black"
        Black = 0x0B
    }
	export enum LEDs {
        //% blockId="LED_right" block="right"
        LED_R = 8,
        //% blockId="LED_left" block="left"
        LED_L = 16
    }
	export enum LEDswitch {
        //% blockId="on" block="on"
        on = 0,
        //% blockId="off" block="off"
        off = 1
    }
    
	//% weight=100
    //% blockId=motor_MotorRun block="motor|%index|PWM value|%PWM"
    //% PWM.min=-1000 PWM.max=1000
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=3
    export function motorRun(index: Motors, PWM: number): void {
        let i2cbuf = pins.createBuffer(3);
        if (index == 0) {
            i2cbuf[0] = 0x02;
            i2cbuf[1] = PWM >> 8;
            i2cbuf[2] = PWM;
            pins.i2cWriteBuffer(N76_ADDR, i2cbuf);
        }
        if (index == 1) {
            i2cbuf[0] = 0x00;
            i2cbuf[1] = PWM >> 8;
            i2cbuf[2] = PWM;
            pins.i2cWriteBuffer(N76_ADDR, i2cbuf);
        }
        if (index == 2) {	
            i2cbuf[0] = 0x00;
            i2cbuf[1] = PWM >> 8;
            i2cbuf[2] = PWM;
            pins.i2cWriteBuffer(N76_ADDR, i2cbuf);
            i2cbuf[0] = 0x02;
            pins.i2cWriteBuffer(N76_ADDR, i2cbuf);
        }
    }
	
	//% weight=90
    //% blockId=sensor_readIR block="read |%SensorID sensor"
    //% SensorID.fieldEditor="gridpicker" SensorID.fieldOptions.columns=3
    export function readIR(SensorID: IR_Sensors): number {
        pins.i2cWriteNumber(
            N76_ADDR,
            SensorID,
            NumberFormat.UInt8LE,
            false
        )
        return pins.i2cReadNumber(N76_ADDR, NumberFormat.UInt16BE, false)
    }
	//% weight=85
	//% blockId=sensor_readIR2 block="read IRsensor |%SensorID"
	//% SensorIDs.min=0 SensorIDs.max=4
    export function readIR2(SensorIDs: number): number {
        pins.i2cWriteNumber(
            N76_ADDR,
            SensorIDs+3,
            NumberFormat.UInt8LE,
            false
        )
        return pins.i2cReadNumber(N76_ADDR, NumberFormat.UInt16BE, false)
    }
	//% weight=80
    //% blockId=LED_Set block="LED|%LedPin|%status"
    //% LedPin.fieldEditor="gridpicker" LedPin.fieldOptions.columns=1
    //% status.fieldEditor="gridpicker" status.fieldOptions.columns=1
	export function LED(LedPin: LEDs,status: LEDswitch): void {
        if (LedPin == LEDs.LED_R)
		{
            pins.digitalWritePin(DigitalPin.P8, status)
		}
        else if (LedPin == LEDs.LED_L)
		{
            pins.digitalWritePin(DigitalPin.P16, status)
		}
    }
	
	
	//% color=#2080ff
	//% weight=30
	//% blockId=sensor_StartSampling block="Calibrate Begin"
    export function CalibrateBegin(): void {
        pins.i2cWriteNumber(
            N76_ADDR,
            0x09,
            NumberFormat.UInt8LE,
            false
        )
    }
	
	//% color=#2080ff
	//% weight=20
    //% blockId=sensor_EndSampling block="Calibrate End|%Color (Line)"
    //% Color.fieldEditor="gridpicker" Color.fieldOptions.columns=1
	export function CalibrateEnd(Color: LineColor): void {
        pins.i2cWriteNumber(
            N76_ADDR,
            Color,
            NumberFormat.UInt8LE,
            false
        )
    }
	
	//% color=#2080ff
    //% weight=10
    //% blockId=sensor_Line block="read Line position"
    export function readLine(): number {
        pins.i2cWriteNumber(
            N76_ADDR,
            0x08,
            NumberFormat.UInt8LE,
            false
        )
        return pins.i2cReadNumber(N76_ADDR, NumberFormat.Int16BE, false) / 1000
    }
}
