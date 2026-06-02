"""widen genre columns to support multiple genres (comma-separated)

Revision ID: e2f3a4b5c6d7
Revises: d1e2f3a4b5c6
Create Date: 2026-06-02 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'e2f3a4b5c6d7'
down_revision: Union[str, Sequence[str], None] = 'd1e2f3a4b5c6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('artists', 'genre', type_=sa.String(250), existing_nullable=False)
    op.alter_column('artist_submissions', 'genre', type_=sa.String(250), existing_nullable=True)


def downgrade() -> None:
    op.alter_column('artists', 'genre', type_=sa.String(50), existing_nullable=False)
    op.alter_column('artist_submissions', 'genre', type_=sa.String(80), existing_nullable=True)
