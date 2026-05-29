"""add email and edit token fields to artists

Revision ID: d4e8b2f1a9c3
Revises: c1a3f9d82e45
Create Date: 2026-05-29 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'd4e8b2f1a9c3'
down_revision: Union[str, Sequence[str], None] = 'c1a3f9d82e45'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('artists', sa.Column('email', sa.String(254), nullable=True))
    op.add_column('artists', sa.Column('edit_token_hash', sa.String(128), nullable=True))
    op.add_column('artists', sa.Column('edit_token_expires_at', sa.TIMESTAMP(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column('artists', 'edit_token_expires_at')
    op.drop_column('artists', 'edit_token_hash')
    op.drop_column('artists', 'email')
