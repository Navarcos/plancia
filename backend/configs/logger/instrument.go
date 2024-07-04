package logger

import (
	"context"
	"fmt"
	"go.uber.org/zap"
)

type RequestKey string

const RequestIdKey RequestKey = "request-id"

func Debug(ctx context.Context, message string, fields ...zap.Field) {
	requestId := ctx.Value(RequestIdKey)
	if requestId != nil {
		fields = append(fields, zap.String("requestId", fmt.Sprintf("%s", ctx.Value(RequestIdKey))))
	}
	zap.L().Debug(message, fields...)
}

func Info(ctx context.Context, message string, fields ...zap.Field) {
	requestId := ctx.Value(RequestIdKey)
	if requestId != nil {
		fields = append(fields, zap.String("requestId", fmt.Sprintf("%s", ctx.Value(RequestIdKey))))
	}
	zap.L().Info(message, fields...)
}

func Warn(ctx context.Context, message string, fields ...zap.Field) {
	requestId := ctx.Value(RequestIdKey)
	if requestId != nil {
		fields = append(fields, zap.String("requestId", fmt.Sprintf("%s", ctx.Value(RequestIdKey))))
	}
	zap.L().Warn(message, fields...)
}

func Error(ctx context.Context, message string, fields ...zap.Field) {
	requestId := ctx.Value(RequestIdKey)
	if requestId != nil {
		fields = append(fields, zap.String("requestId", fmt.Sprintf("%s", ctx.Value(RequestIdKey))))
	}
	zap.L().Error(message, fields...)
}
