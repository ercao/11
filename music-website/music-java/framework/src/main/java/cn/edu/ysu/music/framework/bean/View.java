package cn.edu.ysu.music.framework.bean;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

/**
 * @author ercao
 */
@Getter
@RequiredArgsConstructor
public class View {
    private final String path;
    private final Map<String, Object> model;


    public View(String path) {
        this.path = path;
        this.model = new HashMap<>();
    }

    public void addModel(String key, Object value) {
        model.put(key, value);
    }
}
