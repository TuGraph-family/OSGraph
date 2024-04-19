package com.alipay.tumaker.core.model;

import com.alipay.tumaker.common.dal.mysql.model.PersonLDO;

import java.util.List;

public class PersonLPageDto {
    private Long totalSize;
    private int index;
    private int pageSize;
    private List<PersonLDO> data;

    public Long getTotalSize() {
        return totalSize;
    }

    public void setTotalSize(Long totalSize) {
        this.totalSize = totalSize;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public List<PersonLDO> getData() {
        return data;
    }

    public void setData(List<PersonLDO> data) {
        this.data = data;
    }
}
