export class IpDto {
    Ip: string;
    City: string;
    Loction: any;
    Postal: string;
    Country: string;

    public static ToEntity(item: any) {
        if (item) {
            let obj: IpDto = {
                Postal: item.postal,
                City: item.city || item.regionName || item.city,
                Ip: item.ip || item.query || item.ipAddress || item.IPv4,
                Country: item.country || item.countryCode || item.countryCode || item.country_code,
                Loction: item.loc || ((item.lat || item.latitude) + ',' + (item.lon || item.longitude)),
            };
            return obj;
        }
        return null;
    }
}