/**
 * ScienceBlock Extra Sensor
 * ADS1115 External Sensor
 */

//% color="#2f74ff" icon="\uf0e7" block="외부센서측정" weight=10
namespace ExtraSensor {

    let adsAddress = 0x48

    const ADS1115_PGA_4_096V = 0x0200
    const ADS1115_DR_128SPS = 0x0080
    const ADS1115_MODE_SINGLE = 0x0100
    const ADS1115_COMP_DISABLE = 0x0003
    const ADS1115_OS_SINGLE = 0x8000

    export enum SensorChannel {
        //% block="A0"
        A0 = 0,

        //% block="A1"
        A1 = 1
    }

    function writeRegister(reg: number, value: number): void {
        let buf = pins.createBuffer(3)
        buf[0] = reg
        buf[1] = (value >> 8) & 0xFF
        buf[2] = value & 0xFF
        pins.i2cWriteBuffer(adsAddress, buf, false)
    }

    function readRegister(reg: number): number {
        pins.i2cWriteNumber(
            adsAddress,
            reg,
            NumberFormat.UInt8BE,
            false
        )

        let buf = pins.i2cReadBuffer(
            adsAddress,
            2,
            false
        )

        return (buf[0] << 8) | buf[1]
    }

    function toSigned16(value: number): number {
        if (value > 0x7FFF) {
            return value - 0x10000
        }

        return value
    }

    function mux(channel: SensorChannel): number {

        if (channel == SensorChannel.A0) {
            return 0x4000
        }

        return 0x5000
    }

    function readADC(channel: SensorChannel): number {

        let config =
            ADS1115_OS_SINGLE |
            mux(channel) |
            ADS1115_PGA_4_096V |
            ADS1115_MODE_SINGLE |
            ADS1115_DR_128SPS |
            ADS1115_COMP_DISABLE

        writeRegister(0x01, config)

        basic.pause(10)

        return toSigned16(
            readRegister(0x00)
        )
    }


    /**
     * 외부센서측정 시작
     */
    //% block="외부센서측정 시작"
    //% weight=100
    export function init(): void {

        adsAddress = 0x48
    }


    /**
     * 외부센서 전압측정
     */
    //% block="외부센서 $channel 전압측정"
    //% weight=90
    export function voltage(
        channel: SensorChannel
    ): number {

        let raw = readADC(channel)

        let adcVoltage =
            raw * 4.096 / 32768

        return adcVoltage
    }
}