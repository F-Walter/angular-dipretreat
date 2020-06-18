import { Sensor } from './Sensor';

export class PremiseData{

public date:Date

constructor(date:string, public sensor:Sensor){
this.date = new Date(date)

}



toString(){
return `${this.date} - ${this.sensor.toString()}`
}





}