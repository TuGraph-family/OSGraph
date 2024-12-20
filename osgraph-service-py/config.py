import logging

from dotenv import load_dotenv

load_dotenv()


class Config:
    LOG_LEVEL = logging.INFO


class DevelopmentConfig(Config):
    DEBUG = True
    LOG_LEVEL = logging.DEBUG


class ProductionConfig(Config):
    DEBUG = False
    LOG_LEVEL = logging.INFO
