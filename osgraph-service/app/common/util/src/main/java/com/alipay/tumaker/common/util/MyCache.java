package com.alipay.tumaker.common.util;


import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * @author Created by XiangChen
 * @date 2024/4/26 15:37
 */
public class MyCache {
    //collection of key-value pairs
    public final Map<String, Entity> hashMap;
    //Timer thread pool for clearing expired cache
    private static final ScheduledExecutorService executorService = new ScheduledThreadPoolExecutor(
            1, new PlatformThreadFactory(MyCache.class.getName()));
    private final ReentrantReadWriteLock reentrantReadWriteLock = new ReentrantReadWriteLock();

    public MyCache(){
        hashMap = new ConcurrentHashMap<>();
    }

    /**
     * Add cache, permanently
     *
     * @param key  key
     * @param data value
     */
    public void putForever(String key, Object data) {
        try {
            reentrantReadWriteLock.writeLock().lock();
            //No expiration time set
            hashMap.put(key, new Entity(data, null));
        } finally {
            reentrantReadWriteLock.writeLock().unlock();
        }
    }

    /**
     * Add cache with expiration time
     *
     * @param key    key
     * @param data   value
     * @param expire Expiration time
     * @param timeUnit  time unit
     */
    public void put(String key, Object data, long expire, TimeUnit timeUnit) {
        //Clear original key-value pairs
        remove(key);
        //Set expiration time
        Future future = executorService.schedule(new Runnable() {
            @Override
            public void run() {
                //Clear the key-value pair after expiration
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
     * read cache
     *
     * @param key key
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
     * read cache
     *
     * @param key key
     * @param clazz value type
     * @return  T
     */
    public  <T> T get(String key, Class<T> clazz) {
        return clazz.cast(get(key));
    }

    /**
     * clear cache
     *
     * @param key key
     * @return Object
     */
    public Object remove(String key) {
        Entity entity = removeKey(key);
        if (entity == null) {
            return null;
        }
        //Clear the original key-value pair timer
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
     * Query the number of currently cached key-value pairs
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
            //Clear original cached data
            entity = hashMap.remove(key);
        } finally {
            reentrantReadWriteLock.writeLock().unlock();
        }
        return entity;
    }

    /**
     * Caching entity classes
     */
    private static class Entity {
        //The value of the key-value pair
        private Object value;
        //TimerFuture
        private Future future;

        public Entity(Object value, Future future) {
            this.value = value;
            this.future = future;
        }

        /**
         * Get value
         *
         * @return Object
         */
        public Object getValue() {
            return value;
        }

        /**
         * Get Future object
         *
         * @return Future
         */
        public Future getFuture() {
            return future;
        }
    }
}
