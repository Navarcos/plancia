package logger

import (
	"fmt"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func Init(logLevel string) error {
	zapLevel := encodeZapLevel(logLevel)
	encoderCfg := encoderConfig()
	zapConfig := config(zapLevel, encoderCfg)
	logger, err := zapConfig.Build(zap.AddCallerSkip(1))
	if err != nil {
		return fmt.Errorf("fail to initialize logger: %w", err)
	}
	zap.ReplaceGlobals(logger)
	zap.RedirectStdLog(logger)
	return nil
}

func encoderConfig() zapcore.EncoderConfig {
	return zapcore.EncoderConfig{
		MessageKey:     "msg",
		LevelKey:       "level",
		TimeKey:        "timestamp",
		CallerKey:      "caller",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeLevel:    zapcore.CapitalLevelEncoder,
		EncodeDuration: zapcore.SecondsDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder,
	}
}

func config(level zap.AtomicLevel, encoderConfig zapcore.EncoderConfig) *zap.Config {
	c := &zap.Config{
		Level:             level,
		Development:       false,
		DisableCaller:     false,
		DisableStacktrace: true,
		Sampling: &zap.SamplingConfig{
			Initial:    100,
			Thereafter: 100,
		},
		Encoding:         "json",
		EncoderConfig:    encoderConfig,
		OutputPaths:      []string{"stderr"},
		ErrorOutputPaths: []string{"stderr"},
	}
	return c
}

func encodeZapLevel(logLevel string) zap.AtomicLevel {
	switch logLevel {
	case "Debug", "debug", "DEBUG":
		return zap.NewAtomicLevelAt(zapcore.DebugLevel)
	case "Warn", "warn", "WARN":
		return zap.NewAtomicLevelAt(zapcore.WarnLevel)
	case "Error", "error", "ERROR":
		return zap.NewAtomicLevelAt(zapcore.ErrorLevel)
	case "Fatal", "fatal", "FATAL":
		return zap.NewAtomicLevelAt(zapcore.ErrorLevel)
	default:
		return zap.NewAtomicLevelAt(zapcore.InfoLevel)
	}
}
