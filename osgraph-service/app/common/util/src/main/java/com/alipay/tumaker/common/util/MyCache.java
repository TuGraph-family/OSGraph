package com.alipay.tumaker.common.util;


import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * @author Created by XiangChen
 * @date 2024/4/26 15:37
 */
public class MyCache {
    //键值对集合
    public final Map<String, Entity> hashMap;
    //定时器线程池，用于清除过期缓存
    private static final ScheduledExecutorService executorService = new ScheduledThreadPoolExecutor(
            1, new PlatformThreadFactory(MyCache.class.getName()));
    private final ReentrantReadWriteLock reentrantReadWriteLock = new ReentrantReadWriteLock();

    public MyCache(){
        hashMap = new ConcurrentHashMap<>();
    }

    /**
     * 添加缓存，永久
     *
     * @param key  键
     * @param data 值
     */
    public void putForever(String key, Object data) {
        try {
            reentrantReadWriteLock.writeLock().lock();
            //不设置过期时间
            hashMap.put(key, new Entity(data, null));
        } finally {
            reentrantReadWriteLock.writeLock().unlock();
        }
    }

    /**
     * 添加缓存，有过期时间
     *
     * @param key    键
     * @param data   值
     * @param expire 过期时间
     * @param timeUnit  时间单位
     */
    public void put(String key, Object data, long expire, TimeUnit timeUnit) {
        //清除原键值对
        remove(key);
        //设置过期时间
        Future future = executorService.schedule(new Runnable() {
            @Override
            public void run() {
                //过期后清除该键值对
                try {
                    reentrantReadWriteLock.writeLock().lock();
                    Object object = hashMap.remove(key);
                } finally {
                    reentrantReadWriteLock.writeLock().unlock();
                }
            }
        }, expire, timeUnit);
        try {
            reentrantReadWriteLock.writeLock().lock();
            hashMap.put(key, new Entity(data, future));
        } finally {
            reentrantReadWriteLock.writeLock().unlock();
        }
    }

    /**
     * 读取缓存
     *
     * @param key 键
     * @return Object
     */
    public Object get(String key) {
        Entity entity;
        try {
            reentrantReadWriteLock.readLock().lock();
            entity = hashMap.get(key);
        } finally {
            reentrantReadWriteLock.readLock().unlock();
        }
        return entity == null ? null : entity.getValue();
    }

    /**
     * 读取缓存
     *
     * @param key 键
     * @param clazz 值类型
     * @return  T
     */
    public  <T> T get(String key, Class<T> clazz) {
        return clazz.cast(get(key));
    }

    /**
     * 清除缓存
     *
     * @param key 键
     * @return Object
     */
    public Object remove(String key) {
        Entity entity = removeKey(key);
        if (entity == null) {
            return null;
        }
        //清除原键值对定时器
        Future future = entity.getFuture();
        if (future != null) {
            future.cancel(true);
        }
        return entity.getValue();
    }

    public void clear() {
        try {
            reentrantReadWriteLock.writeLock().lock();
            hashMap.clear();
        } finally {
            reentrantReadWriteLock.writeLock().unlock();
        }
    }

    /**
     * judge whether contain key
     * @param key key
     * @return boolean
     */
    public boolean containsKey(String key){
        try {
            reentrantReadWriteLock.readLock().lock();
            return hashMap.containsKey(key);
        } finally {
            reentrantReadWriteLock.readLock().unlock();
        }
    }

    /**
     * 查询当前缓存的键值对数量
     *
     * @return size
     */
    public int size() {
        try {
            reentrantReadWriteLock.readLock().lock();
            return hashMap.size();
        } finally {
            reentrantReadWriteLock.readLock().unlock();
        }
    }

    private Entity removeKey(String key){
        Entity entity;
        try {
            reentrantReadWriteLock.writeLock().lock();
            //清除原缓存数据
            entity = hashMap.remove(key);
        } finally {
            reentrantReadWriteLock.writeLock().unlock();
        }
        return entity;
    }

    /**
     * 缓存实体类
     */
    private static class Entity {
        //键值对的value
        private Object value;
        //定时器Future
        private Future future;

        public Entity(Object value, Future future) {
            this.value = value;
            this.future = future;
        }

        /**
         * 获取值
         *
         * @return Object
         */
        public Object getValue() {
            return value;
        }

        /**
         * 获取Future对象
         *
         * @return Future
         */
        public Future getFuture() {
            return future;
        }
    }
}
