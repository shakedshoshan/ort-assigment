"""
Timezone utilities for the application.
Handles Israel timezone (Asia/Jerusalem) for consistent datetime handling.
"""

from datetime import datetime
import pytz


def get_israel_timezone():
    """
    Get the Israel timezone object.
    
    Returns:
        pytz.timezone: Israel timezone object
    """
    return pytz.timezone('Asia/Jerusalem')


def now_israel():
    """
    Get current datetime in Israel timezone.
    
    Returns:
        datetime: Current datetime in Israel timezone
    """
    israel_tz = get_israel_timezone()
    return datetime.now(israel_tz)


def utc_to_israel(utc_dt):
    """
    Convert UTC datetime to Israel timezone.
    
    Args:
        utc_dt: UTC datetime object
        
    Returns:
        datetime: Datetime in Israel timezone
    """
    if utc_dt is None:
        return None
    
    israel_tz = get_israel_timezone()
    if utc_dt.tzinfo is None:
        # Assume it's UTC if no timezone info
        utc_dt = pytz.utc.localize(utc_dt)
    return utc_dt.astimezone(israel_tz)


def israel_to_utc(israel_dt):
    """
    Convert Israel datetime to UTC.
    
    Args:
        israel_dt: Israel datetime object
        
    Returns:
        datetime: Datetime in UTC
    """
    if israel_dt is None:
        return None
    
    israel_tz = get_israel_timezone()
    if israel_dt.tzinfo is None:
        # Assume it's Israel time if no timezone info
        israel_dt = israel_tz.localize(israel_dt)
    return israel_dt.astimezone(pytz.utc)
