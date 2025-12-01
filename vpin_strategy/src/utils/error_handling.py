"""
Error Handling Utilities - V3.2 FINAL
안전한 계산 래퍼 및 에러 처리
"""
from typing import Callable, Any, Tuple
import logging
import traceback

# 로거 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def log_error(message: str):
    """에러 로깅"""
    logger.error(message)


def safe_calculate(default_value: Any, error_reason: str):
    """
    안전한 계산 데코레이터

    Args:
        default_value: 에러 시 반환할 기본값
        error_reason: 에러 이유 코드

    Returns:
        decorator function

    Example:
        @safe_calculate(default_value=1.0, error_reason="OB_RATIO")
        def calculate_orderbook_imbalance(bids, asks):
            ratio = bid_volume / ask_volume
            return ratio, True
    """
    def decorator(func: Callable):
        def wrapper(*args, **kwargs) -> Tuple[Any, str]:
            try:
                result = func(*args, **kwargs)
                # 함수가 tuple 반환하면 그대로, 아니면 (result, "OK")로 감싸기
                if isinstance(result, tuple):
                    return result
                else:
                    return result, "OK"

            except ZeroDivisionError:
                log_error(f"{func.__name__}: Division by zero")
                return default_value, f"{error_reason}_DIV_ZERO"

            except ValueError as e:
                log_error(f"{func.__name__}: ValueError - {str(e)}")
                return default_value, f"{error_reason}_VALUE_ERROR"

            except IndexError as e:
                log_error(f"{func.__name__}: IndexError - {str(e)}")
                return default_value, f"{error_reason}_INDEX_ERROR"

            except Exception as e:
                log_error(f"{func.__name__}: {type(e).__name__} - {str(e)}")
                traceback.print_exc()
                return default_value, f"{error_reason}_ERROR"

        return wrapper
    return decorator


def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
    """
    안전한 나눗셈

    Args:
        numerator: 분자
        denominator: 분모
        default: 0으로 나눌 때 반환값

    Returns:
        계산 결과 또는 기본값
    """
    try:
        if denominator == 0:
            return default
        return numerator / denominator
    except:
        return default


def safe_list_access(lst: list, index: int, default: Any = None) -> Any:
    """
    안전한 리스트 접근

    Args:
        lst: 리스트
        index: 인덱스
        default: 범위 밖일 때 반환값

    Returns:
        리스트 원소 또는 기본값
    """
    try:
        return lst[index] if 0 <= index < len(lst) else default
    except:
        return default


class SafeCalculator:
    """
    안전한 계산을 위한 헬퍼 클래스
    """
    @staticmethod
    def mean(values: list, default: float = 0.0) -> float:
        """안전한 평균 계산"""
        try:
            if not values:
                return default
            return sum(values) / len(values)
        except:
            return default

    @staticmethod
    def percentile(values: list, percentile: float, default: float = 0.0) -> float:
        """안전한 백분위수 계산"""
        try:
            if not values:
                return default
            import numpy as np
            return np.percentile(values, percentile)
        except:
            return default

    @staticmethod
    def std(values: list, default: float = 0.0) -> float:
        """안전한 표준편차 계산"""
        try:
            if not values or len(values) < 2:
                return default
            import numpy as np
            return np.std(values)
        except:
            return default
