export class Sensor {
    sensor_description
    sensor_data
    sensor_timestamp
    sensor_coord
    premises_name

    constructor(sensor) {
        this.sensor_description = sensor.sensor_description
        this.sensor_data = sensor.sensor_data
        this.sensor_timestamp = sensor.sensor_timestamp
        this.sensor_coord = sensor.sensor_coord
        this.premises_name = sensor.premises_name
    }

    toString(){
        return `${this.premises_name} ${this.sensor_description} ${this.sensor_data}`
    }


}