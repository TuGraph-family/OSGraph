FROM acs-reg.alipay.com/antstack/sofaboot-dragonwell8-onbuild:2210.6 AS BUILDER


# using build mode: release
ENV build_mode release
#RUN cp /opt/taobao/install/maven/settings-${build_mode}.xml /root/.m2/settings.xml

# build package
RUN bash build.sh tumaker . /home/admin/release

### image for running

FROM  acs-reg.alipay.com/antstack/sofaboot-dragonwell8-anolisos:2210.6

WORKDIR /home/admin

# copy app package from builder image
COPY --from=BUILDER /home/admin/release/target.tar.gz /home/admin/release/run/

# 获取前端资源
#ARG YUYAN_STATIC_ASSETS_URL

#RUN curl -LS $YUYAN_STATIC_ASSETS_URL > static-assets.tgz && tar xzvf static-assets.tgz

# add entrypoint
COPY conf /conf
COPY biz/database/tumaker /conf/db/tumaker

USER root
RUN  cd /etc/yum.repos.d/ \
    && sed -i 's/ucdatax.uc.local:8087/yum.tbsite.net/g' *.repo \
    && sed -i 's/uchttp.o.uodoo.com:8087/yum.tbsite.net/g' *.repo \
    && sed -i 's/uchttp.o.uodoo.com:8086/shenma-repo.alibaba-inc.com/g' *.repo \
    && sed -i 's/uchttp.o.uodoo.com:8088/yum.ops.yisou.com/g' *.repo

RUN bash /conf/bin/build.sh


#CMD /bin/bash -c "sleep inf"
#CMD []
ENTRYPOINT ["/bin/bash", "/conf/startup.sh"]

