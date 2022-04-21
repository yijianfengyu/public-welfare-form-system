package com.auth.entity;

public class CityGeo {
    private String name;
    private Long value;
    private Float[] geo=new Float[2];

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getValue() {
        return value;
    }

    public void setValue(Long value) {
        this.value = value;
    }

    public Float[] getGeo() {
        return geo;
    }

    public void setGeo(String geo) {
        String[] geoArr=geo.substring(1,geo.length()-1).split(",");
        this.geo[0]=Float.parseFloat(geoArr[0]);
        this.geo[1]=Float.parseFloat(geoArr[1]);
    }
}
