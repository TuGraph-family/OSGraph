#!/bin/bash

USAGE()
{
    echo "usage: "
    echo "    \$1 : app name"
    echo "    \$2 : absolute path to source code root"
    echo "    \$3 : absolute path to output directory, where the .tgz file will be stored"
    echo "no params received, using default values"
}

MVN_BUILD()
{
    # delete maven repo jars
    rm -rf $HOME/.m2/repository/com/alipay/*
    rm -rf $HOME/.m2/repository/com/ipay/*
    rm -rf $HOME/.m2/repository/com/taobao/*
    rm -rf $HOME/.m2/repository/org/codehaus/xfire/*
    rm -rf $HOME/.m2/repository/org/apache/maven/*
    rm -rf $HOME/.m2/repository/org/codehaus/mojo/*

    cd $SRC_PATH
    ls -al
    export MAVEN_OPTS='-Xms256m -Xmx1024m'

    mvn -Dmaven.test.skip=true clean package -U -Denv=prod -Pbus

    # Check Maven Runing
    if [ $? -eq 0 ]; then
        echo "INFO: Maven running success!"
    else
        echo "ERROR: Maven process failed!"
        exit 2
    fi
}

GET_COMMIT ()
{
  commit_dir=$1
  yum install git -y
  git show -s > $commit_dir/commit_info
}

APP_BUILD ()
{
    APPNAME=$1
    SRC_PATH=$2
    OUTPUT_DIR=$3

    if [ -z "$APPNAME" ]; then
        APPNAME="tumaker"
    fi
    if [ -z "$SRC_PATH" ]; then
        SRC_PATH="."
    fi
    if [ -z "$OUTPUT_DIR" ]; then
        OUTPUT_DIR="$HOME/$APPNAME/target"
    fi

    echo "APPNAME=$APPNAME"
    echo "SRC_PATH=$SRC_PATH"
    echo "OUTPUT_DIR=$OUTPUT_DIR"

    # build by maven
    MVN_BUILD

    # output built package
    local target_dir=$SRC_PATH/target
    #cd $target_dir

    #if [ -f $APPNAME-server.tar.gz ]; then
    #    echo "INFO: package successful!"
    #else
    #    echo "ERROR: package failed, exit!"
    #    exit 4
    #fi
    GET_COMMIT $target_dir
    tar -zcf target.tar.gz target

    mkdir -p $OUTPUT_DIR # for compatible

    cp target.tar.gz $OUTPUT_DIR/
    #cp -a $APPNAME-server.tar.gz $OUTPUT_DIR/$APPNAME.tgz
}

# entrypoint

if [ $# -lt 2 ]; then
    USAGE
fi

echo "****************************************************"
echo "* Start building"
echo "* DATE: `date '+%F %T'`"
echo "****************************************************"

export LANG="zh_CN.UTF-8"

echo "=========================="
echo "os info:                  |"
echo "=========================="
uname -a

echo "=========================="
echo "environment variables:    |"
echo "=========================="
printenv

echo "=========================="
echo "java version:             |"
echo "=========================="
java -version

echo "=========================="
echo "maven version:            |"
echo "=========================="
mvn --version

cd `dirname $0`

echo "=========================="
echo "Building...               |"
echo "=========================="

APP_BUILD $1 $2 $3

echo "****************************************************"
echo "* Building End"
echo "* DATE: `date '+%F %T'`"
echo "****************************************************"
