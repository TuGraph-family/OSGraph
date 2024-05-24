package com.alipay.tumaker.common.dal.mysql.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;

/**
 * <p>
 * aaaa bbb  ccc
 * </p>
 *
 * @author dalgen-mybatisplus
 * @since 2024-02-19
 */
@TableName("person_l")
public class PersonLDO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Ccccccc
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private String name;

    private Byte role;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Byte getRole() {
        return role;
    }

    public void setRole(Byte role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "PersonLDO{" +
            "id = " + id +
            ", name = " + name +
            ", role = " + role +
        "}";
    }
}
